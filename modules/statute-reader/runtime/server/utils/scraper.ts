import type { LegalUnit } from '../../types'
import type { StatuteDatabase } from './database'
import { createColoradoCrawler } from './crawlers/colorado'
import { createTexasCrawler } from './crawlers/texas'
import type { CrawlerConfig, ScrapeStats as CrawlerStats } from './crawlers/base'

export interface ScrapeConfig {
  jurisdiction: string
  sourceUrl: string
  publicationId: number
  dryRun?: boolean
  batchSize?: number
  crawlType?: 'full' | 'title'
}

export interface ScrapeStats {
  titlesProcessed: number
  articlesProcessed: number
  sectionsProcessed: number
  errors: number
  startTime: number
  endTime?: number
  urlsDiscovered?: number
  urlsProcessed?: number
}

export class StatuteScraper {
  constructor(private db: StatuteDatabase) {}

  async scrapeColoradoStatutes(config: ScrapeConfig): Promise<ScrapeStats> {
    try {
      console.log(`Starting Crawlee-based scrape for ${config.jurisdiction} from ${config.sourceUrl}`)
      
      // Create crawler configuration
      const crawlerConfig: CrawlerConfig = {
        jurisdiction: config.jurisdiction,
        sourceUrl: config.sourceUrl,
        publicationId: config.publicationId,
        dryRun: config.dryRun,
        batchSize: config.batchSize,
        crawlType: config.crawlType
      }
      
      // Create Colorado-specific crawler
      const crawler = createColoradoCrawler(this.db, crawlerConfig)
      
      // Run the crawler
      const crawlerStats = await crawler.run()
      
      // Convert crawler stats to expected format
      const stats: ScrapeStats = {
        titlesProcessed: crawlerStats.titlesProcessed,
        articlesProcessed: crawlerStats.articlesProcessed,
        sectionsProcessed: crawlerStats.sectionsProcessed,
        errors: crawlerStats.errors,
        startTime: crawlerStats.startTime,
        endTime: crawlerStats.endTime,
        urlsDiscovered: crawlerStats.urlsDiscovered,
        urlsProcessed: crawlerStats.urlsProcessed
      }
      
      console.log(`Crawlee scrape completed. Stats:`, stats)
      return stats
      
    } catch (error) {
      console.error('Crawlee scrape error:', error)
      throw error
    }
  }

  // Multi-jurisdiction scraper - demonstrates extensibility pattern
  async scrapeJurisdiction(config: ScrapeConfig): Promise<ScrapeStats> {
    const jurisdiction = config.jurisdiction.toLowerCase()
    
    // Create crawler configuration
    const crawlerConfig: CrawlerConfig = {
      jurisdiction: config.jurisdiction,
      sourceUrl: config.sourceUrl,
      publicationId: config.publicationId,
      dryRun: config.dryRun,
      batchSize: config.batchSize,
      crawlType: config.crawlType
    }
    
    switch (jurisdiction) {
      case 'colorado':
      case 'co':
        return this.runCrawler(createColoradoCrawler(this.db, crawlerConfig))
        
      case 'texas':
      case 'tx':
        return this.runCrawler(createTexasCrawler(this.db, crawlerConfig))
        
      // Future jurisdictions can be added here:
      // case 'california':
      // case 'ca':
      //   return this.runCrawler(createCaliforniaCrawler(this.db, crawlerConfig))
      //   
      // case 'federal':
      // case 'usc':
      //   return this.runCrawler(createFederalCrawler(this.db, crawlerConfig))
        
      default:
        throw new Error(`Scraping not implemented for jurisdiction: ${config.jurisdiction}. Supported: Colorado (CO), Texas (TX)`)
    }
  }

  /**
   * Generic crawler runner - works with any jurisdiction-specific crawler
   */
  private async runCrawler(crawler: any): Promise<ScrapeStats> {
    try {
      console.log(`Running ${crawler.constructor.name}...`)
      
      const crawlerStats = await crawler.run()
      
      // Convert crawler stats to expected format
      const stats: ScrapeStats = {
        titlesProcessed: crawlerStats.titlesProcessed,
        articlesProcessed: crawlerStats.articlesProcessed,
        sectionsProcessed: crawlerStats.sectionsProcessed,
        errors: crawlerStats.errors,
        startTime: crawlerStats.startTime,
        endTime: crawlerStats.endTime,
        urlsDiscovered: crawlerStats.urlsDiscovered,
        urlsProcessed: crawlerStats.urlsProcessed
      }
      
      console.log(`Crawler completed. Stats:`, stats)
      return stats
      
    } catch (error) {
      console.error('Crawler error:', error)
      throw error
    }
  }

  // Utility methods - these are now handled by the parsers and crawlers
  // but kept for backward compatibility if needed
  
  async generateCitation(
    titleNum?: string,
    articleNum?: string, 
    sectionNum?: string,
    format = 'colorado'
  ): Promise<string> {
    // Generate proper legal citation based on jurisdiction format
    switch (format) {
      case 'colorado':
        if (sectionNum && articleNum && titleNum) {
          return `${titleNum}-${articleNum}-${sectionNum}`
        }
        if (articleNum && titleNum) {
          return `${titleNum}-${articleNum}`
        }
        if (titleNum) {
          return `${titleNum}`
        }
        break
      default:
        // Generic format
        return [titleNum, articleNum, sectionNum].filter(Boolean).join('-')
    }
    
    return ''
  }
}

export const createScraper = (db: StatuteDatabase) => new StatuteScraper(db)