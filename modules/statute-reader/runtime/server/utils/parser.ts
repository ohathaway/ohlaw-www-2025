export interface ParsedElement {
  tag: string
  text: string
  attributes: Record<string, string>
  children: ParsedElement[]
  level?: number
  citation?: string
}

export interface StatuteStructure {
  type: 'title' | 'article' | 'section' | 'subsection' | 'paragraph'
  number?: string
  name?: string
  content: string
  children: StatuteStructure[]
  metadata: Record<string, any>
}

export class StatuteParser {
  // Parse HTML content into structured legal units
  parseHTML(html: string): ParsedElement {
    // TODO: Implement proper HTML parsing
    // This is a simplified placeholder that would use a real HTML parser
    // like jsdom or similar in the actual implementation
    
    const root: ParsedElement = {
      tag: 'root',
      text: '',
      attributes: {},
      children: []
    }
    
    // Simplified parsing - in reality would use proper DOM parsing
    const sections = this.extractSections(html)
    root.children = sections
    
    return root
  }

  // Extract sections from HTML based on common patterns
  private extractSections(html: string): ParsedElement[] {
    const sections: ParsedElement[] = []
    
    // Common patterns for legal documents
    const sectionRegex = /(?:§|Section)\s*(\d+(?:-\d+)*(?:\.\d+)*)\s*\.?\s*([^.\n]+)/gi
    const titleRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi
    
    let match
    
    // Extract section headers
    while ((match = sectionRegex.exec(html)) !== null) {
      const [fullMatch, number, title] = match
      
      sections.push({
        tag: 'section',
        text: title.trim(),
        attributes: { number },
        children: [],
        citation: `§ ${number}`
      })
    }
    
    // Extract heading elements
    while ((match = titleRegex.exec(html)) !== null) {
      const [fullMatch, level, content] = match
      
      sections.push({
        tag: `h${level}`,
        text: this.stripHTML(content),
        attributes: { level },
        children: [],
        level: parseInt(level)
      })
    }
    
    return sections
  }

  // Convert parsed elements to statute structure
  parseToStatuteStructure(element: ParsedElement): StatuteStructure[] {
    const structures: StatuteStructure[] = []
    
    for (const child of element.children) {
      const structure = this.elementToStructure(child)
      if (structure) {
        structures.push(structure)
      }
    }
    
    return structures
  }

  private elementToStructure(element: ParsedElement): StatuteStructure | null {
    // Determine structure type based on element characteristics
    const type = this.determineStructureType(element)
    if (!type) return null
    
    const structure: StatuteStructure = {
      type,
      content: element.text,
      children: [],
      metadata: {}
    }
    
    // Extract number and name based on type
    const parsed = this.parseElementContent(element.text, type)
    structure.number = parsed.number
    structure.name = parsed.name
    
    // Process children recursively
    for (const child of element.children) {
      const childStructure = this.elementToStructure(child)
      if (childStructure) {
        structure.children.push(childStructure)
      }
    }
    
    return structure
  }

  private determineStructureType(element: ParsedElement): StatuteStructure['type'] | null {
    // Determine type based on tag, content patterns, or attributes
    if (element.tag === 'section' || element.citation) {
      return 'section'
    }
    
    if (element.tag.startsWith('h')) {
      const level = element.level || parseInt(element.tag.charAt(1))
      switch (level) {
        case 1:
        case 2:
          return 'title'
        case 3:
        case 4:
          return 'article'
        case 5:
        case 6:
          return 'section'
        default:
          return 'section'
      }
    }
    
    // Check content patterns
    const text = element.text.toLowerCase()
    if (text.includes('title') && /\d+/.test(text)) return 'title'
    if (text.includes('article') && /\d+/.test(text)) return 'article'
    if (text.includes('section') || text.includes('§')) return 'section'
    
    return null
  }

  private parseElementContent(content: string, type: StatuteStructure['type']): { number?: string, name?: string } {
    // Extract number and name from content based on common patterns
    
    // Section pattern: "§ 15-10-101. Short title"
    const sectionMatch = content.match(/(?:§|Section)\s*([0-9-]+)\.?\s*(.*)/)
    if (sectionMatch) {
      return {
        number: sectionMatch[1],
        name: sectionMatch[2].trim()
      }
    }
    
    // Title pattern: "Title 15 - Probate, Trusts, and Fiduciaries"
    const titleMatch = content.match(/Title\s+(\d+)\s*[-–]\s*(.*)/)
    if (titleMatch) {
      return {
        number: titleMatch[1],
        name: titleMatch[2].trim()
      }
    }
    
    // Article pattern: "Article 10 - Colorado Probate Code"
    const articleMatch = content.match(/Article\s+(\d+)\s*[-–]\s*(.*)/)
    if (articleMatch) {
      return {
        number: articleMatch[1],
        name: articleMatch[2].trim()
      }
    }
    
    // Generic number pattern at start
    const numberMatch = content.match(/^(\d+(?:\.\d+)*)\s*[-.]?\s*(.*)/)
    if (numberMatch) {
      return {
        number: numberMatch[1],
        name: numberMatch[2].trim()
      }
    }
    
    return { name: content.trim() }
  }

  // Extract cross-references from content
  extractCrossReferences(content: string): string[] {
    const references: string[] = []
    
    // Common cross-reference patterns
    const patterns = [
      /(?:§|Section)\s*([0-9-]+(?:\.[0-9]+)*)/g,
      /(?:pursuant to|under|see)\s+(?:§|Section)\s*([0-9-]+(?:\.[0-9]+)*)/gi,
      /C\.R\.S\.?\s*§?\s*([0-9-]+(?:\.[0-9]+)*)/g
    ]
    
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(content)) !== null) {
        references.push(match[1])
      }
    }
    
    return [...new Set(references)] // Remove duplicates
  }

  // Extract effective dates and amendments
  extractMetadata(content: string): Record<string, any> {
    const metadata: Record<string, any> = {}
    
    // Effective date patterns
    const effectiveDateMatch = content.match(/effective\s+(\w+\s+\d+,\s+\d+)/i)
    if (effectiveDateMatch) {
      metadata.effective_date = effectiveDateMatch[1]
    }
    
    // Amendment patterns
    const amendmentMatch = content.match(/(?:amended|added|repealed)\s+(?:by\s+)?(\d+\s+\w+\s+\w+)/i)
    if (amendmentMatch) {
      metadata.amendment_info = amendmentMatch[1]
    }
    
    // Source patterns
    const sourceMatch = content.match(/(?:L\.|Laws)\s+(\d+):\s*(\w+\.\s*\d+)/i)
    if (sourceMatch) {
      metadata.source_citation = `${sourceMatch[1]} ${sourceMatch[2]}`
    }
    
    // Editor's notes
    if (content.toLowerCase().includes("editor's note")) {
      metadata.has_editor_note = true
    }
    
    return metadata
  }

  // Clean up HTML content
  cleanHTML(html: string): string {
    return html
      // Remove scripts and styles
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      // Remove comments
      .replace(/<!--.*?-->/gs, '')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Strip HTML tags but preserve structure
  stripHTML(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Convert content to plain text while preserving some formatting
  toPlainText(html: string): string {
    return html
      // Convert block elements to line breaks
      .replace(/<\/?(div|p|br|h[1-6])[^>]*>/gi, '\n')
      // Remove all other HTML
      .replace(/<[^>]*>/g, '')
      // Clean up entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Normalize whitespace
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim()
  }
}

export const createParser = () => new StatuteParser()