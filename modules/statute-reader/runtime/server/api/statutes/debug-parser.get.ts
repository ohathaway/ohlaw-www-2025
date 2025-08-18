import { testColoradoParser } from '../../utils/test-parser'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const testUrl = query.url as string || 'https://olls.info/crs/crs2024-title-43.htm'
    
    console.log(`Testing parser with URL: ${testUrl}`)
    
    const results = await testColoradoParser(testUrl)
    
    return {
      success: true,
      url: testUrl,
      results: results.length,
      statutes: results.map(s => ({
        type: s.unit_type,
        citation: s.citation,
        name: s.name,
        level: s.level
      }))
    }
    
  } catch (error: any) {
    console.error('Parser test error:', error)
    
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})