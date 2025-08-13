import type { 
  SearchQuery, 
  SearchResult, 
  SearchResponse, 
  AutocompleteQuery,
  AutocompleteResponse,
  HighlightPosition 
} from '../../types'
import type { StatuteDatabase } from './database'

export class StatuteSearchEngine {
  constructor(private db: StatuteDatabase) {}

  async search(query: SearchQuery): Promise<SearchResponse> {
    const startTime = Date.now()
    
    try {
      // Sanitize and prepare search query
      const sanitizedQuery = this.sanitizeQuery(query.query)
      if (!sanitizedQuery) {
        return this.emptyResponse(query, startTime)
      }

      // Build FTS query with modifiers
      const ftsQuery = this.buildFTSQuery(sanitizedQuery, query)
      
      // Execute search
      const { results: units, total } = await this.db.searchLegalUnits(
        ftsQuery,
        query.publication_id,
        query.unit_types,
        query.limit || 20,
        query.offset || 0
      )

      // Convert to search results with scoring and highlighting
      const searchResults: SearchResult[] = await Promise.all(
        units.map(unit => this.createSearchResult(unit, sanitizedQuery))
      )

      // Generate suggestions if no results
      const suggestions = searchResults.length === 0 
        ? await this.generateSuggestions(sanitizedQuery)
        : undefined

      return {
        results: searchResults,
        total_count: total,
        query,
        search_time_ms: Date.now() - startTime,
        suggestions
      }
    } catch (error) {
      console.error('Search error:', error)
      return this.emptyResponse(query, startTime)
    }
  }

  async autocomplete(query: AutocompleteQuery): Promise<AutocompleteResponse> {
    const sanitizedQuery = this.sanitizeQuery(query.query)
    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      return { results: [], query: query.query }
    }

    try {
      // Search for citations that start with the query
      const { results: units } = await this.db.searchLegalUnits(
        `citation:${sanitizedQuery}*`,
        query.jurisdiction_id,
        undefined,
        query.limit || 10
      )

      const results = units.map(unit => ({
        citation: unit.citation,
        name: unit.name,
        unit_type: unit.unit_type,
        match_type: 'citation' as const
      }))

      // If no citation matches, try name matches
      if (results.length === 0) {
        const { results: nameUnits } = await this.db.searchLegalUnits(
          `name:${sanitizedQuery}*`,
          query.jurisdiction_id,
          undefined,
          query.limit || 10
        )

        results.push(...nameUnits.map(unit => ({
          citation: unit.citation,
          name: unit.name,
          unit_type: unit.unit_type,
          match_type: 'name' as const
        })))
      }

      return { results, query: query.query }
    } catch (error) {
      console.error('Autocomplete error:', error)
      return { results: [], query: query.query }
    }
  }

  private sanitizeQuery(query: string): string {
    return query
      .trim()
      .replace(/[^\w\s\-\.§]/g, ' ') // Remove special chars except section symbol
      .replace(/\s+/g, ' ')
      .substring(0, 200) // Limit length
  }

  private buildFTSQuery(query: string, searchQuery: SearchQuery): string {
    const terms = query.split(' ').filter(Boolean)
    
    if (searchQuery.exact_match) {
      return `"${query}"`
    }

    // Build proximity search for phrases
    if (terms.length > 1) {
      return `"${query}" OR (${terms.map(term => `${term}*`).join(' AND ')})`
    }

    // Single term with prefix matching
    return `${terms[0]}*`
  }

  private async createSearchResult(unit: any, query: string): Promise<SearchResult> {
    // Calculate basic relevance score (would be enhanced with proper ranking algorithm)
    let score = this.calculateRelevanceScore(unit, query)
    
    // Generate snippet and highlights
    const snippet = this.generateSnippet(unit.content_text || '', query)
    const highlights = this.findHighlightPositions(unit.content_text || '', query)

    // Determine match type
    const matchType = this.determineMatchType(unit, query)

    return {
      unit,
      score,
      snippet,
      highlight_positions: highlights,
      match_type: matchType
    }
  }

  private calculateRelevanceScore(unit: any, query: string): number {
    let score = 0
    const queryLower = query.toLowerCase()
    
    // Citation exact match gets highest score
    if (unit.citation.toLowerCase().includes(queryLower)) {
      score += 100
    }
    
    // Name match gets high score
    if (unit.name?.toLowerCase().includes(queryLower)) {
      score += 50
    }
    
    // Content match gets base score
    if (unit.content_text?.toLowerCase().includes(queryLower)) {
      score += 10
    }
    
    // Boost for exact matches
    if (unit.citation.toLowerCase() === queryLower) {
      score += 200
    }
    
    // Boost by unit type importance (sections are often most relevant)
    switch (unit.unit_type) {
      case 'section':
        score += 20
        break
      case 'article':
        score += 10
        break
      case 'title':
        score += 5
        break
    }
    
    return score
  }

  private generateSnippet(content: string, query: string, maxLength = 200): string {
    if (!content) return ''
    
    const queryLower = query.toLowerCase()
    const contentLower = content.toLowerCase()
    const queryIndex = contentLower.indexOf(queryLower)
    
    if (queryIndex === -1) {
      // No direct match, return beginning
      return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '')
    }
    
    // Center snippet around the match
    const start = Math.max(0, queryIndex - Math.floor(maxLength / 2))
    const end = Math.min(content.length, start + maxLength)
    
    let snippet = content.substring(start, end)
    
    if (start > 0) snippet = '...' + snippet
    if (end < content.length) snippet = snippet + '...'
    
    return snippet
  }

  private findHighlightPositions(content: string, query: string): HighlightPosition[] {
    const positions: HighlightPosition[] = []
    const queryLower = query.toLowerCase()
    const contentLower = content.toLowerCase()
    
    let index = 0
    while ((index = contentLower.indexOf(queryLower, index)) !== -1) {
      positions.push({
        start: index,
        end: index + query.length,
        field: 'content_text'
      })
      index += query.length
    }
    
    return positions
  }

  private determineMatchType(unit: any, query: string): 'exact' | 'partial' | 'fuzzy' | 'semantic' {
    const queryLower = query.toLowerCase()
    
    if (unit.citation.toLowerCase() === queryLower) {
      return 'exact'
    }
    
    if (unit.citation.toLowerCase().includes(queryLower) ||
        unit.name?.toLowerCase().includes(queryLower)) {
      return 'partial'
    }
    
    return 'fuzzy'
  }

  private async generateSuggestions(query: string): Promise<string[]> {
    // Simple suggestion generation - could be enhanced with proper spell correction
    const suggestions: string[] = []
    
    // Try common legal prefixes
    const legalPrefixes = ['§', 'section', 'article', 'title']
    for (const prefix of legalPrefixes) {
      if (!query.toLowerCase().startsWith(prefix)) {
        suggestions.push(`${prefix} ${query}`)
      }
    }
    
    // Try without common words
    const commonWords = ['the', 'and', 'or', 'of', 'in', 'to', 'for']
    const withoutCommon = query.split(' ')
      .filter(word => !commonWords.includes(word.toLowerCase()))
      .join(' ')
    
    if (withoutCommon !== query && withoutCommon.length > 0) {
      suggestions.push(withoutCommon)
    }
    
    return suggestions.slice(0, 3)
  }

  private emptyResponse(query: SearchQuery, startTime: number): SearchResponse {
    return {
      results: [],
      total_count: 0,
      query,
      search_time_ms: Date.now() - startTime
    }
  }
}

export const createSearchEngine = (db: StatuteDatabase) => new StatuteSearchEngine(db)