import type { CheerioAPI } from 'cheerio'

export interface ParsedMetadata {
  source?: string
  crossReferences?: string[]
  editorsNote?: string
  history?: string
  effectiveDate?: string
}

export class CommonParser {
  
  /**
   * Clean and normalize text content
   */
  static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\u00A0/g, ' ') // Non-breaking spaces
      .trim()
  }

  /**
   * Clean HTML content while preserving structure
   */
  static cleanHtml(html: string): string {
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * Extract citation patterns from text
   */
  static extractCitation(text: string, format = 'colorado'): string | null {
    switch (format) {
      case 'colorado':
        // Match patterns like "15-10-101.", "15-10-101.5.", etc.
        const match = text.match(/\b(\d+(?:\.\d+)*-\d+(?:\.\d+)*-\d+(?:\.\d+)*)\./);
        return match ? match[1] : null
      default:
        return null
    }
  }

  /**
   * Parse hierarchical numbers (handles decimals like 1.1, 1.2, etc.)
   */
  static parseHierarchicalNumber(numberStr: string): { 
    primary: number, 
    decimal?: number, 
    sortOrder: number 
  } {
    const parts = numberStr.split('.')
    const primary = parseInt(parts[0]) || 0
    const decimal = parts[1] ? parseInt(parts[1]) : undefined
    
    // Create sort order: primary * 1000 + decimal (if any)
    const sortOrder = primary * 1000 + (decimal || 0)
    
    return { primary, decimal, sortOrder }
  }

  /**
   * Determine unit level based on context and formatting
   */
  static determineUnitLevel(
    $: CheerioAPI, 
    element: any, 
    unitType: string
  ): number {
    switch (unitType) {
      case 'title':
        return 1
      case 'article':
        return 2
      case 'part':
        return 3
      case 'section':
        return 4
      case 'subsection':
        // Check nesting depth for subsections
        const parentSections = $(element).parentsUntil('body').filter((_, el) => {
          const text = $(el).text()
          return this.extractCitation(text) !== null
        }).length
        return Math.min(5 + parentSections, 10) // Cap at level 10
      default:
        return 5
    }
  }

  /**
   * Extract metadata blocks from statute content
   */
  static extractMetadata($: CheerioAPI, element: any): ParsedMetadata {
    const metadata: ParsedMetadata = {}
    const text = $(element).text()
    
    // Extract Source information
    const sourceMatch = text.match(/Source:\s*(.+?)(?=\s*(?:Cross references?:|Editor's note:|$))/i)
    if (sourceMatch) {
      metadata.source = this.cleanText(sourceMatch[1])
    }
    
    // Extract Cross references
    const crossRefMatch = text.match(/Cross references?:\s*(.+?)(?=\s*(?:Source:|Editor's note:|$))/i)
    if (crossRefMatch) {
      metadata.crossReferences = crossRefMatch[1]
        .split(/[;,]/)
        .map(ref => this.cleanText(ref))
        .filter(ref => ref.length > 0)
    }
    
    // Extract Editor's note
    const editorMatch = text.match(/Editor's note:\s*(.+?)(?=\s*(?:Source:|Cross references?:|$))/i)
    if (editorMatch) {
      metadata.editorsNote = this.cleanText(editorMatch[1])
    }
    
    // Extract History
    const historyMatch = text.match(/\(([^)]*(?:L\.|Laws?)[^)]*)\)/g)
    if (historyMatch) {
      metadata.history = historyMatch.join('; ')
    }
    
    return metadata
  }

  /**
   * Generate consistent citation format
   */
  static generateCitation(
    titleNum?: string,
    articleNum?: string,
    partNum?: string,
    sectionNum?: string,
    format = 'colorado'
  ): string {
    switch (format) {
      case 'colorado':
        const parts = [titleNum, articleNum, partNum, sectionNum].filter(Boolean)
        return parts.length > 1 ? `${parts.join('-')}` : parts[0] || ''
      default:
        return [titleNum, articleNum, partNum, sectionNum].filter(Boolean).join('-')
    }
  }

  /**
   * Extract and clean content while preserving important formatting
   */
  static extractContent($: CheerioAPI, element: any): {
    html: string
    text: string
  } {
    // Clone element to avoid modifying original
    const $clone = $.load($(element).html() || '')
    
    // Remove metadata blocks
    $clone('*').filter((_, el) => {
      const text = $clone(el).text()
      return /^(Source:|Cross references?:|Editor's note:)/i.test(text.trim())
    }).remove()
    
    const html = this.cleanHtml($clone.html() || '')
    const text = this.cleanText($clone.text())
    
    return { html, text }
  }

  /**
   * Validate citation format
   */
  static isValidCitation(citation: string, format = 'colorado'): boolean {
    switch (format) {
      case 'colorado':
        return /^\d+(?:\.\d+)*(?:-\d+(?:\.\d+)*)*$/.test(citation)
      default:
        return citation.length > 0
    }
  }
}