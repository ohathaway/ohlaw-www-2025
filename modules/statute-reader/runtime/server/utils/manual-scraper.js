#!/usr/bin/env node

/**
 * Manual Colorado Scraper Test Script
 * Run with: node manual-scraper.js
 */

import { createColoradoCrawler } from './crawlers/colorado.js'
import { StatuteDatabase } from './database.js'

async function runManualScrape() {
  try {
    console.log('🚀 Starting manual Colorado scraper...')
    
    // Mock database for testing
    const mockDb = {
      createLegalUnit: async (unit) => {
        console.log(`[DB] Would create: ${unit.unit_type} - ${unit.citation}`)
        return Math.floor(Math.random() * 1000) // Mock ID
      }
    }
    
    const db = new StatuteDatabase(mockDb)
    
    const config = {
      jurisdiction: 'CO',
      sourceUrl: 'https://leg.colorado.gov/agencies/office-legislative-legal-services/2024-crs-titles-download',
      publicationId: 1,
      dryRun: true,
      batchSize: 1 // Test with just one title
    }
    
    const crawler = createColoradoCrawler(db, config)
    const stats = await crawler.run()
    
    console.log('📊 Final Statistics:')
    console.log(`   Titles: ${stats.titlesProcessed}`)
    console.log(`   Articles: ${stats.articlesProcessed}`)
    console.log(`   Sections: ${stats.sectionsProcessed}`)
    console.log(`   Errors: ${stats.errors}`)
    console.log(`   Duration: ${stats.endTime - stats.startTime}ms`)
    console.log(`   URLs Discovered: ${stats.urlsDiscovered}`)
    console.log(`   URLs Processed: ${stats.urlsProcessed}`)
    
  } catch (error) {
    console.error('❌ Scraper failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runManualScrape()
}