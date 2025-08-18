import type { CheerioAPI } from 'cheerio'
import { CommonParser, type ParsedMetadata } from './common'
import type { ParsedStatute } from '../crawlers/base'

export class ColoradoParser extends CommonParser {
  
  /**
   * Parse Colorado statute HTML structure
   * Handles Title files with hierarchical content: Title→Article→Part→Section
   */
  static parseStatutes($: CheerioAPI, url: string): ParsedStatute[] {
    const statutes: ParsedStatute[] = []
    const urlParts = url.split('/')
    const filename = urlParts[urlParts.length - 1]
    
    console.log(`[ColoradoParser] Processing URL: ${url}`)
    console.log(`[ColoradoParser] Filename: ${filename}`)
    
    // Extract title number from filename - handle different patterns
    let titleMatch = filename.match(/title-(\d+(?:\.\d+)?)/i)
    if (!titleMatch) {
      titleMatch = filename.match(/crs\d+-title-(\d+(?:\.\d+)?)/i)
    }
    if (!titleMatch) {
      console.warn(`[ColoradoParser] Could not extract title number from URL: ${url}`)
      // Try to find title in page content instead
      const pageTitle = $('title').text()
      console.log(`[ColoradoParser] Page title: ${pageTitle}`)
      const pageTitleMatch = pageTitle.match(/title\s+(\d+)/i)
      if (pageTitleMatch) {
        titleMatch = pageTitleMatch
        console.log(`[ColoradoParser] Extracted title from page title: ${pageTitleMatch[1]}`)
      } else {
        return statutes
      }
    }
    
    const titleNumber = titleMatch[1]
    console.log(`[ColoradoParser] Title number: ${titleNumber}`)
    
    // Debug: Show some of the page content
    const bodyText = $('body').text().substring(0, 500)
    console.log(`[ColoradoParser] First 500 chars of body: ${bodyText}`)
    
    // Find the title element - look for text containing the title
    let titleElement = $('*').filter((_, el) => {
      const text = $(el).text().toUpperCase()
      return text.includes(`TITLE ${titleNumber}`) || text.includes(`TITLE${titleNumber}`)
    }).first()
    
    // If no explicit title element, use the body or first heading
    if (!titleElement.length) {
      titleElement = $('h1, h2, h3').first()
      if (!titleElement.length) {
        titleElement = $('body')
      }
      console.log(`[ColoradoParser] Using fallback title element: ${titleElement.prop('tagName')}`)
    } else {
      console.log(`[ColoradoParser] Found title element: ${titleElement.text().substring(0, 100)}`)
    }
    
    if (titleElement.length) {
      const titleStatute = this.parseTitle($, titleElement, titleNumber)
      if (titleStatute) {
        statutes.push(titleStatute)
        console.log(`[ColoradoParser] Created title statute: ${titleStatute.citation}`)
      }
    }
    
    // Parse articles within this title (articles only, not sections)
    const articles = this.parseArticlesOnly($, titleNumber)
    console.log(`[ColoradoParser] Found ${articles.length} articles`)
    statutes.push(...articles)
    
    // If articles were found, parse sections within each article
    if (articles.length > 0) {
      console.log(`[ColoradoParser] Parsing sections within ${articles.length} articles`)
      for (const article of articles) {
        const articleElement = this.findArticleElement($, article.number!, titleNumber)
        if (articleElement) {
          const sections = this.parseSections($, articleElement, titleNumber, article.number!)
          console.log(`[ColoradoParser] Found ${sections.length} sections in article ${article.number}`)
          statutes.push(...sections)
        }
      }
    } else {
      // If no articles found, try to parse sections directly
      console.log(`[ColoradoParser] No articles found, trying direct section parsing`)
      const sections = this.parseDirectSections($, titleNumber)
      console.log(`[ColoradoParser] Found ${sections.length} direct sections`)
      statutes.push(...sections)
    }
    
    console.log(`[ColoradoParser] Total statutes parsed: ${statutes.length}`)
    return statutes
  }

  /**
   * Parse title information
   */
  private static parseTitle($: CheerioAPI, element: any, titleNumber: string): ParsedStatute | null {
    const text = $(element).text()
    const titleMatch = text.match(/TITLE\s+(\d+(?:\.\d+)?)\s*[-–—]\s*(.+)/i)
    
    if (!titleMatch) return null
    
    const [, num, name] = titleMatch
    const content = this.extractContent($, element)
    const hierarchy = this.parseHierarchicalNumber(num)
    
    return {
      unit_type: 'title',
      level: 1,
      number: num,
      name: this.cleanText(name),
      citation: num,
      content_html: content.html,
      content_text: content.text,
      sort_order: hierarchy.sortOrder,
      metadata: this.extractMetadata($, element)
    }
  }

  /**
   * Parse articles within a title (articles only, no sections)
   * Handles flat P-element structure where everything is in sequential paragraphs
   */
  private static parseArticlesOnly($: CheerioAPI, titleNumber: string): ParsedStatute[] {
    const articles: ParsedStatute[] = []
    
    // Look for P elements containing ARTICLE patterns in STRONG/B elements
    $('p').each((_, pElement) => {
      const $p = $(pElement)
      const strongText = $p.find('strong, b').text()
      
      // Look for "ARTICLE X" pattern in bold text
      const articleMatch = strongText.match(/^ARTICLE\s+(\d+(?:\.\d+)?)$/i)
      if (articleMatch) {
        const articleNumber = articleMatch[1]
        console.log(`[ColoradoParser] Found article in P element: ARTICLE ${articleNumber}`)
        
        // Get the article name from the next P element if it exists
        const nextP = $p.next('p')
        let articleName = undefined
        if (nextP.length) {
          const nextText = nextP.text().trim()
          // If next P doesn't start with a citation or special formatting, use as name
          if (nextText && !nextText.match(/^\d+-\d+-\d+/) && !nextText.includes('Cross references:') && !nextText.includes('Editor\'s note:')) {
            articleName = nextText
          }
        }
        
        const citation = this.generateCitation(titleNumber, articleNumber)
        const content = this.extractContent($, $p)
        const hierarchy = this.parseHierarchicalNumber(articleNumber)
        
        console.log(`[ColoradoParser] Creating article: ${citation} - ${articleName}`)
        
        articles.push({
          unit_type: 'article',
          level: 2,
          number: articleNumber,
          name: articleName ? this.cleanText(articleName) : undefined,
          citation,
          parent_citation: titleNumber,
          content_html: content.html,
          content_text: content.text,
          sort_order: hierarchy.sortOrder,
          metadata: this.extractMetadata($, $p)
        })
      }
    })
    
    console.log(`[ColoradoParser] Found ${articles.length} articles using flat P-element parsing`)
    return articles
  }

  /**
   * Find the P element that contains an article
   */
  private static findArticleElement($: CheerioAPI, articleNumber: string, titleNumber: string): any {
    // Look for P elements containing "ARTICLE {articleNumber}" in strong/b elements
    const articleElements = $('p').filter((_, pElement) => {
      const strongText = $(pElement).find('strong, b').text()
      return new RegExp(`^ARTICLE\\s+${articleNumber}$`, 'i').test(strongText)
    })
    
    return articleElements.first()
  }

  /**
   * Collect content for a section from current P element until next section/article
   */
  private static collectSectionContent($: CheerioAPI, sectionP: any, titleNumber: string): { html: string, text: string } {
    const contentParts: string[] = []
    let currentP = sectionP
    
    // Include the section header P
    contentParts.push(currentP.prop('outerHTML') || '')
    
    // Collect subsequent P elements until next section or article
    while (currentP.length) {
      currentP = currentP.next('p')
      if (!currentP.length) break
      
      const strongText = currentP.find('strong, b').text()
      
      // Stop if we hit another section (citation pattern)
      if (strongText.match(/^\d+-\d+-\d+/)) {
        break
      }
      
      // Stop if we hit an article
      if (strongText.match(/^ARTICLE\s+\d+$/i)) {
        break
      }
      
      // Stop if we hit "Source:" which marks end of section
      if (strongText.includes('Source:')) {
        contentParts.push(currentP.prop('outerHTML') || '')
        break
      }
      
      contentParts.push(currentP.prop('outerHTML') || '')
    }
    
    const combinedHtml = contentParts.join('\n')
    const $content = $.load(combinedHtml)
    
    return {
      html: this.cleanHtml(combinedHtml),
      text: this.cleanText($content.text())
    }
  }

  /**
   * Parse articles within a title (legacy method that mixed articles and sections)
   */
  private static parseArticles($: CheerioAPI, titleNumber: string): ParsedStatute[] {
    const statutes: ParsedStatute[] = []
    
    // Look for article headings with various patterns
    const articleSelectors = [
      // Bold elements with ARTICLE
      'b:contains("ARTICLE"), strong:contains("ARTICLE")',
      // Any element with ARTICLE in text
      '*'
    ]
    
    // Try different selectors
    for (const selector of articleSelectors) {
      let articlesFound = 0
      
      if (selector === '*') {
        // Look through all elements for ARTICLE pattern
        $('*').filter((_, el) => {
          const text = $(el).text()
          return /ARTICLE\s+\d+/i.test(text)
        }).each((_, el) => {
          console.log(`[ColoradoParser] Found potential article: ${$(el).text().substring(0, 100)}`)
          const article = this.parseArticle($, $(el), titleNumber)
          if (article) {
            statutes.push(article)
            articlesFound++
            console.log(`[ColoradoParser] Created article: ${article.citation}`)
            
            // Parse sections within this article
            const sections = this.parseSections($, $(el), titleNumber, article.number!)
            console.log(`[ColoradoParser] Found ${sections.length} sections in article ${article.number}`)
            statutes.push(...sections)
          }
        })
        
        if (articlesFound > 0) break // Found articles, stop trying selectors
      } else {
        const articleElements = $(selector)
        console.log(`[ColoradoParser] Found ${articleElements.length} elements with selector ${selector}`)
        
        articleElements.each((_, el) => {
          const article = this.parseArticle($, $(el), titleNumber)
          if (article) {
            statutes.push(article)
            articlesFound++
            
            // Parse sections within this article
            const sections = this.parseSections($, $(el), titleNumber, article.number!)
            statutes.push(...sections)
          }
        })
        
        if (articlesFound > 0) break // Found articles, stop trying selectors
      }
    }
    
    return statutes
  }

  /**
   * Parse individual article
   */
  private static parseArticle($: CheerioAPI, element: any, titleNumber: string): ParsedStatute | null {
    const text = element.text()
    const articleMatch = text.match(/ARTICLE\s+(\d+(?:\.\d+)?)\s*[-–—]?\s*(.+)?/i)
    
    if (!articleMatch) return null
    
    const [, articleNumber, name] = articleMatch
    const content = this.extractContent($, element)
    const hierarchy = this.parseHierarchicalNumber(articleNumber)
    const citation = this.generateCitation(titleNumber, articleNumber)
    
    console.log(`[ColoradoParser] Creating article: ${citation} (unit_type: article, parent: ${titleNumber})`)
    
    return {
      unit_type: 'article',
      level: 2,
      number: articleNumber,
      name: name ? this.cleanText(name) : undefined,
      citation,
      parent_citation: titleNumber,
      content_html: content.html,
      content_text: content.text,
      sort_order: hierarchy.sortOrder,
      metadata: this.extractMetadata($, element)
    }
  }

  /**
   * Parse sections within an article 
   * Handles flat P-element structure
   */
  private static parseSections($: CheerioAPI, articleElement: any, titleNumber: string, articleNumber: string): ParsedStatute[] {
    const sections: ParsedStatute[] = []
    
    // Find the P element containing this article
    const articleP = articleElement.closest('p')
    if (!articleP.length) {
      console.log(`[ColoradoParser] Could not find P element for article ${articleNumber}`)
      return sections
    }
    
    // Look through subsequent P elements for sections belonging to this article
    let currentP = articleP
    const targetPattern = new RegExp(`^${titleNumber}-${articleNumber}-(\\d+(?:\\.\\d+)?)`)
    
    while (currentP.length) {
      currentP = currentP.next('p')
      if (!currentP.length) break
      
      // Check if this P contains a section for our article
      const strongText = currentP.find('strong, b').text()
      const sectionMatch = strongText.match(targetPattern)
      
      if (sectionMatch) {
        const fullCitation = sectionMatch[0]
        const sectionNumber = sectionMatch[1]
        
        console.log(`[ColoradoParser] Found section: ${fullCitation}`)
        
        // Extract section name (text after citation and period)
        // Handle multi-line titles by using dotall flag and trimming whitespace
        const nameMatch = strongText.match(new RegExp(`${fullCitation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\.\\s*(.+?)\\s*$`, 's'))
        const sectionName = nameMatch ? nameMatch[1].trim().replace(/\s+/g, ' ') : undefined
        
        // Collect content for this section
        const sectionContent = this.collectSectionContent($, currentP, titleNumber)
        const hierarchy = this.parseHierarchicalNumber(sectionNumber)
        const parentCitation = this.generateCitation(titleNumber, articleNumber)
        
        console.log(`[ColoradoParser] Creating section: ${fullCitation} - ${sectionName}`)
        
        sections.push({
          unit_type: 'section',
          level: 4,
          number: sectionNumber,
          name: sectionName ? this.cleanText(sectionName) : undefined,
          citation: fullCitation,
          parent_citation: parentCitation,
          content_html: sectionContent.html,
          content_text: sectionContent.text,
          sort_order: hierarchy.sortOrder,
          metadata: this.extractMetadata($, currentP)
        })
      }
      
      // Stop if we hit the next article
      const nextArticleMatch = currentP.find('strong, b').text().match(/^ARTICLE\s+\d+/i)
      if (nextArticleMatch) {
        console.log(`[ColoradoParser] Stopped at next article: ${nextArticleMatch[0]}`)
        break
      }
    }
    
    return sections
  }

  /**
   * Parse individual section
   */
  private static parseSection(
    $: CheerioAPI, 
    element: any, 
    titleNumber: string, 
    articleNumber: string, 
    fullCitation: string
  ): ParsedStatute | null {
    // Extract section number from full citation
    const citationParts = fullCitation.split('-')
    if (citationParts.length < 3) return null
    
    const sectionNumber = citationParts[2]
    const text = element.text()
    
    // Extract section name - typically follows the citation
    const nameMatch = text.match(/\d+(?:\.\d+)*-\d+(?:\.\d+)*-\d+(?:\.\d+)*\.\s*(.+)/);
    const name = nameMatch ? this.cleanText(nameMatch[1]) : undefined
    
    // Get the full content of this section
    const sectionContent = this.extractSectionContent($, element)
    const hierarchy = this.parseHierarchicalNumber(sectionNumber)
    const parentCitation = this.generateCitation(titleNumber, articleNumber)
    
    return {
      unit_type: 'section',
      level: 4,
      number: sectionNumber,
      name,
      citation: fullCitation,
      parent_citation: parentCitation,
      content_html: sectionContent.html,
      content_text: sectionContent.text,
      sort_order: hierarchy.sortOrder,
      metadata: this.extractMetadata($, element)
    }
  }

  /**
   * Extract full section content including subsections
   */
  private static extractSectionContent($: CheerioAPI, sectionElement: any): { html: string, text: string } {
    // Find the parent container that holds this section's content
    let container = sectionElement.parent()
    
    // Look for the content between this section and the next section
    const nextSectionElement = this.findNextSection($, sectionElement)
    
    let content = ''
    let current = sectionElement
    
    while (current.length && !current.is(nextSectionElement)) {
      content += current.prop('outerHTML') || ''
      current = current.next()
    }
    
    const $content = $.load(content)
    
    return {
      html: this.cleanHtml($content.html() || ''),
      text: this.cleanText($content.text())
    }
  }

  /**
   * Find the next section element
   */
  private static findNextSection($: CheerioAPI, currentElement: any): any {
    let next = currentElement.next()
    
    while (next.length) {
      const boldElements = next.find('b, strong').addBack().filter('b, strong')
      
      const hasNextSection = boldElements.toArray().some(el => {
        const text = $(el).text()
        const citation = this.extractCitation(text)
        return citation && this.isValidCitation(citation)
      })
      
      if (hasNextSection) {
        return next
      }
      
      next = next.next()
    }
    
    return $() // Empty jQuery object
  }

  /**
   * Check if element contains the next article
   */
  private static isNextArticle($: CheerioAPI, element: any): boolean {
    const text = element.text()
    return /ARTICLE\s+\d+(?:\.\d+)?/i.test(text) && element.css('font-weight') === 'bold'
  }

  /**
   * Parse subsections within a section (for future enhancement)
   */
  private static parseSubsections($: CheerioAPI, sectionElement: any, sectionCitation: string): ParsedStatute[] {
    const subsections: ParsedStatute[] = []
    
    // Look for numbered or lettered subsections
    // This would be implemented based on Colorado's specific subsection patterns
    // For now, returning empty array as placeholder
    
    return subsections
  }

  /**
   * Parse sections directly from the page when no articles are found
   * Handles flat P-element structure
   */
  private static parseDirectSections($: CheerioAPI, titleNumber: string): ParsedStatute[] {
    const sections: ParsedStatute[] = []
    
    console.log(`[ColoradoParser] Looking for direct sections with pattern ${titleNumber}-*-*`)
    
    // Look through P elements for section citations in strong/b elements
    $('p').each((_, pElement) => {
      const $p = $(pElement)
      const strongText = $p.find('strong, b').text()
      
      // Look for citations that start with our title number
      const citationMatch = strongText.match(new RegExp(`^(${titleNumber}-\\d+(?:\\.\\d+)?-\\d+(?:\\.\\d+)?)`))
      if (citationMatch) {
        const fullCitation = citationMatch[1]
        const parts = fullCitation.split('-')
        
        if (parts.length >= 3) {
          const articleNumber = parts[1]
          const sectionNumber = parts[2]
          
          console.log(`[ColoradoParser] Found direct section: ${fullCitation}`)
          
          // Extract section name (text after citation and period)
          // Handle multi-line titles by using dotall flag and trimming whitespace
          const nameMatch = strongText.match(new RegExp(`${fullCitation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\.\\s*(.+?)\\s*$`, 's'))
          const sectionName = nameMatch ? nameMatch[1].trim().replace(/\s+/g, ' ') : undefined
          
          // Collect content for this section
          const sectionContent = this.collectSectionContent($, $p, titleNumber)
          const hierarchy = this.parseHierarchicalNumber(sectionNumber)
          const parentCitation = this.generateCitation(titleNumber, articleNumber)
          
          console.log(`[ColoradoParser] Creating direct section: ${fullCitation} - ${sectionName}`)
          
          sections.push({
            unit_type: 'section',
            level: 4,
            number: sectionNumber,
            name: sectionName ? this.cleanText(sectionName) : undefined,
            citation: fullCitation,
            parent_citation: parentCitation,
            content_html: sectionContent.html,
            content_text: sectionContent.text,
            sort_order: hierarchy.sortOrder,
            metadata: this.extractMetadata($, $p)
          })
        }
      }
    })
    
    console.log(`[ColoradoParser] Total direct sections created: ${sections.length}`)
    return sections
  }

  /**
   * Create a basic section structure
   */
  private static createBasicSection(
    titleNumber: string,
    articleNumber: string,
    sectionNumber: string,
    citation: string
  ): ParsedStatute | null {
    const hierarchy = this.parseHierarchicalNumber(sectionNumber)
    const parentCitation = `${titleNumber}-${articleNumber}`
    
    console.log(`[ColoradoParser] Creating section: ${citation} (unit_type: section, parent: ${parentCitation})`)
    
    return {
      unit_type: 'section',
      level: 4,
      number: sectionNumber,
      name: `Section ${citation}`, // Placeholder name
      citation,
      parent_citation: parentCitation,
      content_html: `<p>Content for section ${citation}</p>`,
      content_text: `Content for section ${citation}`,
      sort_order: hierarchy.sortOrder,
      metadata: {}
    }
  }

  /**
   * Find the element that contains the section content
   */
  private static findSectionElement($: CheerioAPI, citation: string, startElement: any): any {
    // Look for bold elements containing the citation
    const citationElements = $('b, strong').filter((_, el) => {
      return $(el).text().includes(citation)
    })
    
    if (citationElements.length > 0) {
      return citationElements.first()
    }
    
    // Fallback to the start element
    return startElement
  }

  /**
   * Parse a direct section
   */
  private static parseDirectSection(
    $: CheerioAPI,
    element: any,
    titleNumber: string,
    articleNumber: string,
    sectionNumber: string,
    citation: string
  ): ParsedStatute | null {
    const text = element.text()
    
    // Extract section name if it follows the citation
    const nameMatch = text.match(new RegExp(`${citation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\.?\\s*(.+?)(?:\\n|$|\\.|\\s{2,})`))
    const name = nameMatch ? this.cleanText(nameMatch[1]) : undefined
    
    // Get section content
    const content = this.extractSectionContentDirect($, element, citation)
    const hierarchy = this.parseHierarchicalNumber(sectionNumber)
    const parentCitation = `${titleNumber}-${articleNumber}`
    
    return {
      unit_type: 'section',
      level: 4,
      number: sectionNumber,
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
   * Extract section content for direct parsing
   */
  private static extractSectionContentDirect($: CheerioAPI, element: any, citation: string): { html: string, text: string } {
    // Get the parent container
    let container = element.parent()
    if (!container.length) {
      container = element
    }
    
    // Get text content around the citation
    const containerText = container.text()
    const citationIndex = containerText.indexOf(citation)
    
    if (citationIndex >= 0) {
      // Try to extract content from citation to next section or reasonable break
      const afterCitation = containerText.substring(citationIndex)
      const nextSectionMatch = afterCitation.match(/\n\s*\d+-\d+-\d+/)
      
      let content = afterCitation
      if (nextSectionMatch) {
        content = afterCitation.substring(0, nextSectionMatch.index)
      } else {
        // Limit to reasonable length
        content = content.substring(0, 2000)
      }
      
      return {
        html: this.cleanHtml(`<p>${content}</p>`),
        text: this.cleanText(content)
      }
    }
    
    // Fallback
    const content = this.extractContent($, element)
    return content
  }

  /**
   * Colorado-specific citation validation
   */
  static isValidColoradoCitation(citation: string): boolean {
    // Colorado citations can be:
    // - Title only: "15"
    // - Title-Article: "15-10" 
    // - Title-Article-Section: "15-10-101"
    // May include decimal numbers (e.g., "15-10.5-101.5")
    
    // Title only (1+ digits, optional decimal)
    if (/^\d+(?:\.\d+)?$/.test(citation)) return true
    
    // Title-Article (Title-Article)
    if (/^\d+(?:\.\d+)?-\d+(?:\.\d+)?$/.test(citation)) return true
    
    // Title-Article-Section (Title-Article-Section) 
    if (/^\d+(?:\.\d+)?-\d+(?:\.\d+)?-\d+(?:\.\d+)?$/.test(citation)) return true
    
    return false
  }
}