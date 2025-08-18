import type { CheerioAPI } from 'cheerio'
import { CommonParser, type ParsedMetadata } from './common'
import type { ParsedStatute } from '../crawlers/base'

/**
 * Texas Statute Parser - Example implementation for multi-jurisdiction extensibility
 * Texas organizes statutes by subject-matter "Codes" rather than numbered titles
 */
export class TexasParser extends CommonParser {
  
  /**
   * Parse Texas statute HTML structure
   * Texas uses Codes (Business & Commerce, Family, Education, etc.) 
   * instead of numbered titles like Colorado
   */
  static parseStatutes($: CheerioAPI, url: string): ParsedStatute[] {
    const statutes: ParsedStatute[] = []
    
    // Extract code information from URL or page content
    const codeInfo = this.extractCodeInfo($, url)
    if (!codeInfo) {
      console.warn(`Could not extract code information from URL: ${url}`)
      return statutes
    }
    
    // Parse the code as a top-level unit
    const codeStatute = this.parseCode($, codeInfo)
    if (codeStatute) {
      statutes.push(codeStatute)
    }
    
    // Parse titles within this code
    const titles = this.parseTitles($, codeInfo.abbreviation)
    statutes.push(...titles)
    
    return statutes
  }

  /**
   * Extract code information from URL or page content
   */
  private static extractCodeInfo($: CheerioAPI, url: string): { 
    name: string, 
    abbreviation: string 
  } | null {
    // Try to extract from URL first
    const urlMatch = url.match(/\/([A-Z]{2,4})\.htm/i)
    if (urlMatch) {
      const abbr = urlMatch[1].toUpperCase()
      // Map common Texas code abbreviations
      const codeNames: Record<string, string> = {
        'BC': 'Business & Commerce Code',
        'CP': 'Civil Practice & Remedies Code',
        'ED': 'Education Code',
        'FA': 'Family Code',
        'GV': 'Government Code',
        'HS': 'Health & Safety Code',
        'IN': 'Insurance Code',
        'LG': 'Local Government Code',
        'PE': 'Penal Code',
        'PR': 'Property Code',
        'TX': 'Tax Code',
        'UT': 'Utilities Code'
      }
      
      return {
        name: codeNames[abbr] || `${abbr} Code`,
        abbreviation: abbr
      }
    }
    
    // Try to extract from page title
    const titleElement = $('title, h1').first()
    const titleText = titleElement.text()
    const titleMatch = titleText.match(/(\w+(?:\s+&\s+\w+)*)\s+Code/i)
    
    if (titleMatch) {
      const name = titleMatch[0]
      const abbreviation = this.generateCodeAbbreviation(name)
      return { name, abbreviation }
    }
    
    return null
  }

  /**
   * Generate code abbreviation from full name
   */
  private static generateCodeAbbreviation(name: string): string {
    return name
      .split(/\s+/)
      .filter(word => word.length > 2 && word !== '&')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
  }

  /**
   * Parse code as top-level unit
   */
  private static parseCode($: CheerioAPI, codeInfo: { name: string, abbreviation: string }): ParsedStatute | null {
    const content = this.extractContent($, $('body'))
    
    return {
      unit_type: 'title', // Map code to title level for consistency
      level: 1,
      number: codeInfo.abbreviation,
      name: codeInfo.name,
      citation: codeInfo.abbreviation,
      content_html: content.html,
      content_text: content.text,
      sort_order: this.getCodeSortOrder(codeInfo.abbreviation),
      metadata: this.extractMetadata($, $('body'))
    }
  }

  /**
   * Parse titles within a Texas code
   * Texas codes are organized into numbered titles
   */
  private static parseTitles($: CheerioAPI, codeAbbreviation: string): ParsedStatute[] {
    const titles: ParsedStatute[] = []
    
    // Look for title headings - Texas often uses "TITLE n" format
    $('*').filter((_, el) => {
      const text = $(el).text()
      return /TITLE\s+\d+/i.test(text)
    }).each((_, el) => {
      const title = this.parseTitle($, $(el), codeAbbreviation)
      if (title) {
        titles.push(title)
        
        // Parse chapters within this title
        const chapters = this.parseChapters($, $(el), codeAbbreviation, title.number!)
        titles.push(...chapters)
      }
    })
    
    return titles
  }

  /**
   * Parse individual title
   */
  private static parseTitle($: CheerioAPI, element: any, codeAbbreviation: string): ParsedStatute | null {
    const text = element.text()
    const titleMatch = text.match(/TITLE\s+(\d+)\s*[-–—]?\s*(.+)?/i)
    
    if (!titleMatch) return null
    
    const [, titleNumber, name] = titleMatch
    const content = this.extractContent($, element)
    const hierarchy = this.parseHierarchicalNumber(titleNumber)
    const citation = `${codeAbbreviation}-${titleNumber}`
    
    return {
      unit_type: 'article', // Map title to article level
      level: 2,
      number: titleNumber,
      name: name ? this.cleanText(name) : undefined,
      citation,
      parent_citation: codeAbbreviation,
      content_html: content.html,
      content_text: content.text,
      sort_order: hierarchy.sortOrder,
      metadata: this.extractMetadata($, element)
    }
  }

  /**
   * Parse chapters within a title
   * Texas uses "Chapter" as a subdivision of titles
   */
  private static parseChapters($: CheerioAPI, titleElement: any, codeAbbreviation: string, titleNumber: string): ParsedStatute[] {
    const chapters: ParsedStatute[] = []
    
    // Find chapter headings after this title
    let currentElement = titleElement.next()
    
    while (currentElement.length && !this.isNextTitle($, currentElement)) {
      const chapterMatch = currentElement.text().match(/CHAPTER\s+(\d+(?:\.\d+)?)/i)
      if (chapterMatch) {
        const chapter = this.parseChapter($, currentElement, codeAbbreviation, titleNumber, chapterMatch[1])
        if (chapter) {
          chapters.push(chapter)
          
          // Parse sections within this chapter
          const sections = this.parseSections($, currentElement, codeAbbreviation, titleNumber, chapterMatch[1])
          chapters.push(...sections)
        }
      }
      
      currentElement = currentElement.next()
    }
    
    return chapters
  }

  /**
   * Parse individual chapter
   */
  private static parseChapter(
    $: CheerioAPI, 
    element: any, 
    codeAbbreviation: string, 
    titleNumber: string, 
    chapterNumber: string
  ): ParsedStatute | null {
    const text = element.text()
    const chapterMatch = text.match(/CHAPTER\s+\d+(?:\.\d+)?\s*[-–—]?\s*(.+)?/i)
    
    const name = chapterMatch?.[1] ? this.cleanText(chapterMatch[1]) : undefined
    const content = this.extractContent($, element)
    const hierarchy = this.parseHierarchicalNumber(chapterNumber)
    const citation = `${codeAbbreviation}-${titleNumber}-${chapterNumber}`
    const parentCitation = `${codeAbbreviation}-${titleNumber}`
    
    return {
      unit_type: 'section', // Map chapter to section level
      level: 4,
      number: chapterNumber,
      name,
      citation,
      parent_citation: parentCitation,
      content_html: content.html,
      content_text: content.text,
      sort_order: hierarchy.sortOrder,
      metadata: this.extractMetadata($, element)
    }
  }

  /**
   * Parse sections within a chapter (placeholder)
   */
  private static parseSections(
    $: CheerioAPI, 
    chapterElement: any, 
    codeAbbreviation: string, 
    titleNumber: string, 
    chapterNumber: string
  ): ParsedStatute[] {
    // Texas section parsing would be implemented here
    // Similar to Colorado but with Texas-specific patterns
    return []
  }

  /**
   * Check if element contains the next title
   */
  private static isNextTitle($: CheerioAPI, element: any): boolean {
    const text = element.text()
    return /TITLE\s+\d+/i.test(text)
  }

  /**
   * Get sort order for Texas codes
   */
  private static getCodeSortOrder(abbreviation: string): number {
    const codeOrder: Record<string, number> = {
      'AG': 100, 'BC': 200, 'CP': 300, 'ED': 400, 'EL': 500,
      'ES': 600, 'FA': 700, 'FI': 800, 'GV': 900, 'HS': 1000,
      'HR': 1100, 'IN': 1200, 'LA': 1300, 'LG': 1400, 'NR': 1500,
      'OC': 1600, 'PE': 1700, 'PR': 1800, 'SD': 1900, 'TX': 2000,
      'TR': 2100, 'UT': 2200, 'WA': 2300
    }
    
    return codeOrder[abbreviation] || 9999
  }

  /**
   * Texas-specific citation validation
   */
  static isValidTexasCitation(citation: string): boolean {
    // Texas citations follow pattern: Code-Title-Chapter-Section
    return /^[A-Z]{2,4}(-\d+)*$/.test(citation)
  }
}