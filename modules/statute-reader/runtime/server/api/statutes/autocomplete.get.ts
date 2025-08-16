import { createStatuteDatabase } from '../../utils/database'
import type { AutocompleteApiResponse } from '../../../types'

export default defineEventHandler(async (event): Promise<AutocompleteApiResponse> => {
  try {

    // Parse query parameters
    const query = getQuery(event)
    const searchQuery = query.query as string
    const jurisdictionId = query.jurisdiction_id ? parseInt(query.jurisdiction_id as string) : undefined
    const limit = Math.min(parseInt(query.limit as string) || 10, 20) // Cap at 20

    // Validate required fields
    if (!searchQuery || searchQuery.trim().length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Query must be at least 2 characters long'
      })
    }

    const statuteDb = createStatuteDatabase()

    // For autocomplete, we want quick matches on citation and title
    // Use a simpler query focusing on citation and name matches
    let autocompleteQuery = `
      SELECT lu.citation, lu.name, lu.unit_type, p.abbreviation as publication_abbr
      FROM legal_units lu
      JOIN publications p ON lu.publication_id = p.id
      WHERE lu.status = 'active'
      AND (
        lu.citation LIKE ? OR 
        lu.name LIKE ? OR
        lu.citation LIKE ? OR
        lu.name LIKE ?
      )
    `
    
    const params: any[] = [
      `${searchQuery}%`,        // Citation starts with
      `${searchQuery}%`,        // Name starts with  
      `%${searchQuery}%`,       // Citation contains
      `%${searchQuery}%`        // Name contains
    ]

    if (jurisdictionId) {
      autocompleteQuery += ' AND p.jurisdiction_id = ?'
      params.push(jurisdictionId)
    }

    autocompleteQuery += ' ORDER BY LENGTH(lu.citation), lu.citation LIMIT ?'
    params.push(limit)

    const results = await hubDatabase().prepare(autocompleteQuery).bind(...params).all()

    // Transform results into autocomplete format
    const autocompleteResults = (results.results as any[]).map(result => ({
      citation: result.citation,
      name: result.name,
      unit_type: result.unit_type,
      publication_abbr: result.publication_abbr,
      display_text: `${result.citation} - ${result.name}`,
      value: result.citation
    }))

    return {
      success: true,
      data: {
        results: autocompleteResults,
        total_count: autocompleteResults.length,
        query: searchQuery
      },
      meta: {
        request_id: event.node.req.headers['x-request-id'] as string,
        cache_hit: false,
        query_length: searchQuery.length,
        limit
      }
    }
  } catch (error: any) {
    console.error('Autocomplete API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during autocomplete',
      data: {
        error: error.message
      }
    })
  }
})