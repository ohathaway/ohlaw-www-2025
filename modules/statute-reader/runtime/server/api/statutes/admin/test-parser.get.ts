import { ColoradoParser } from '../../../utils/parsers/colorado'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const testUrl = query.url as string || 'https://olls.info/crs/crs2024-title-43.htm'
    
    console.log(`🧪 Testing parser with: ${testUrl}`)
    
    // Fetch the HTML
    const response = await fetch(testUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }
    
    const html = await response.text()
    
    // Parse with Cheerio
    const { load } = await import('cheerio')
    const $ = load(html)
    
    // Test the parser
    const statutes = ColoradoParser.parseStatutes($, testUrl)
    
    // Count by type
    const counts = {
      titles: statutes.filter(s => s.unit_type === 'title').length,
      articles: statutes.filter(s => s.unit_type === 'article').length,
      sections: statutes.filter(s => s.unit_type === 'section').length,
      total: statutes.length
    }
    
    return {
      success: true,
      url: testUrl,
      counts,
      sample_statutes: statutes.slice(0, 10).map(s => ({
        type: s.unit_type,
        citation: s.citation,
        name: s.name?.substring(0, 50) + '...',
        level: s.level
      })),
      all_citations: statutes.map(s => s.citation)
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})