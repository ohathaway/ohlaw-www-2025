import { createStatuteDatabase } from '../../../utils/database'
import { createColoradoCrawler } from '../../../utils/crawlers/colorado'

export default defineEventHandler(async (event) => {
  try {
    console.log('🧪 Running test scraper...')
    
    const db = createStatuteDatabase()
    
    const config = {
      jurisdiction: 'CO',
      sourceUrl: 'https://leg.colorado.gov/agencies/office-legislative-legal-services/2024-crs-titles-download',
      publicationId: 1,
      dryRun: true,
      batchSize: 1
    }
    
    const crawler = createColoradoCrawler(db, config)
    const stats = await crawler.run()
    
    return {
      success: true,
      message: 'Test scraper completed',
      stats,
      debug: {
        config,
        timestamp: new Date().toISOString()
      }
    }
    
  } catch (error: any) {
    console.error('Test scraper error:', error)
    
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})