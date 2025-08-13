import { createStatuteDatabase, createScraper } from '../../utils'
import type { ScrapeRequest, ScrapeResponse } from '../../../types'

export default defineEventHandler(async (event): Promise<ScrapeResponse> => {
  try {
    // Get the database binding from runtime config
    const { statuteReader } = useRuntimeConfig()
    const db = (event.context.cloudflare?.env as any)?.[statuteReader.database.binding]
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database not available'
      })
    }

    // Parse and validate the scrape request
    const body = await readBody(event)
    const scrapeRequest: ScrapeRequest = {
      jurisdiction: body.jurisdiction || '',
      source_url: body.source_url || '',
      force_refresh: body.force_refresh || false,
      dry_run: body.dry_run || false
    }

    // Validate required fields
    if (!scrapeRequest.jurisdiction) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Jurisdiction is required'
      })
    }

    if (!scrapeRequest.source_url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Source URL is required'
      })
    }

    // Validate URL format
    try {
      new URL(scrapeRequest.source_url)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid source URL format'
      })
    }

    const statuteDb = createStatuteDatabase(db)
    const scraper = createScraper(statuteDb)

    // Get or create jurisdiction and publication
    let jurisdiction = await statuteDb.getJurisdictionByAbbreviation(
      scrapeRequest.jurisdiction.toUpperCase()
    )
    
    if (!jurisdiction) {
      throw createError({
        statusCode: 400,
        statusMessage: `Unknown jurisdiction: ${scrapeRequest.jurisdiction}`
      })
    }

    // Get publications for this jurisdiction
    const publications = await statuteDb.getPublications(jurisdiction.id)
    const currentPublication = publications.find(p => p.active)
    
    if (!currentPublication) {
      throw createError({
        statusCode: 400,
        statusMessage: `No active publication found for jurisdiction: ${scrapeRequest.jurisdiction}`
      })
    }

    // Check if scraping is already in progress
    // TODO: Implement proper job tracking/locking mechanism
    
    // Perform the scrape based on jurisdiction
    let stats
    switch (scrapeRequest.jurisdiction.toLowerCase()) {
      case 'colorado':
      case 'co':
        stats = await scraper.scrapeColoradoStatutes({
          jurisdiction: scrapeRequest.jurisdiction,
          sourceUrl: scrapeRequest.source_url,
          publicationId: currentPublication.id,
          dryRun: scrapeRequest.dry_run,
          batchSize: 100
        })
        break
      default:
        throw createError({
          statusCode: 400,
          statusMessage: `Scraping not implemented for jurisdiction: ${scrapeRequest.jurisdiction}`
        })
    }

    const response: ScrapeResponse = {
      success: true,
      message: scrapeRequest.dry_run 
        ? 'Dry run completed successfully' 
        : 'Scraping completed successfully',
      stats: {
        titles_processed: stats.titlesProcessed,
        articles_processed: stats.articlesProcessed,
        sections_processed: stats.sectionsProcessed,
        errors: stats.errors,
        duration_ms: (stats.endTime || Date.now()) - stats.startTime
      }
    }

    return response
  } catch (error: any) {
    console.error('Scrape API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    return {
      success: false,
      message: `Scraping failed: ${error.message}`,
      stats: {
        titles_processed: 0,
        articles_processed: 0,
        sections_processed: 0,
        errors: 1,
        duration_ms: 0
      },
      errors: [error.message]
    }
  }
})