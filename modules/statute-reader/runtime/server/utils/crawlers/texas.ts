import { CheerioCrawler, type CheerioCrawlerOptions } from 'crawlee'
import { BaseCrawler, type CrawlerConfig, type ParsedStatute } from './base'
import type { StatuteDatabase } from '../database'

/**
 * Texas Statute Crawler - Example implementation for multi-jurisdiction extensibility
 * This demonstrates how to add support for additional jurisdictions using the same
 * Crawlee infrastructure with jurisdiction-specific parsing logic.
 */
export class TexasCrawler extends BaseCrawler {
  
  constructor(db: StatuteDatabase, config: CrawlerConfig) {
    super(db, config)
  }

  /**
   * Discover Texas statute URLs 
   * Texas may have a different URL structure than Colorado
   */
  async discoverUrls(): Promise<string[]> {
    const urls: string[] = []
    
    try {
      // Texas-specific URL discovery logic would go here
      // For example, Texas might organize statutes by subject matter rather than title numbers
      
      this.log('Discovering Texas statute URLs...')
      
      // Example: Texas might have URLs like:
      // - Business & Commerce Code
      // - Civil Practice & Remedies Code  
      // - Education Code
      // - Family Code
      // etc.
      
      const response = await fetch(this.config.sourceUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${this.config.sourceUrl}: ${response.statusText}`)
      }
      
      const html = await response.text()
      const { load } = await import('cheerio')
      const $ = load(html)
      
      // Look for Texas-specific patterns
      $('a[href*="statutes"], a[href*="code"]').each((_, element) => {
        const href = $(element).attr('href')
        if (href) {
          const url = href.startsWith('http') ? href : new URL(href, this.config.sourceUrl).toString()
          
          // Filter for relevant Texas statute files
          if (this.isValidTexasUrl(url)) {
            urls.push(url)
          }
        }
      })
      
      this.log(`Discovered ${urls.length} Texas statute URLs`)
      return urls.slice(0, this.config.batchSize || 25) // Smaller batch for initial testing
      
    } catch (error) {
      this.log('Error discovering Texas URLs:', error)
      throw error
    }
  }

  /**
   * Create Crawlee crawler configured for Texas statutes
   * Uses different settings optimized for Texas's website structure
   */
  createCrawler(): CheerioCrawler {
    const crawlerOptions: CheerioCrawlerOptions = {
      requestHandler: async ({ $, request, log }) => {
        this.stats.urlsProcessed++
        
        try {
          this.log(`Processing Texas statute: ${request.url}`)
          
          // Parse using Texas-specific parser
          const statutes = await this.parseStatutes($.html(), request.url)
          
          if (statutes.length > 0) {
            this.log(`Parsed ${statutes.length} Texas statutes from ${request.url}`)
            await this.saveStatutes(statutes)
          } else {
            this.log(`No statutes found in ${request.url}`)
          }
          
        } catch (error) {
          this.stats.errors++
          this.log(`Error processing Texas statute ${request.url}:`, error)
          throw error
        }
      },
      
      failedRequestHandler: ({ request, error, log }) => {
        this.stats.errors++
        this.log(`Texas request failed: ${request.url}`, { error: error.message })
      },
      
      // Texas-specific crawler configuration
      maxRequestRetries: 3,
      requestHandlerTimeoutSecs: 45, // Texas site might be slower
      maxConcurrency: 1, // Be more conservative with Texas
      
      // Texas-specific headers
      preNavigationHooks: [
        async ({ request }) => {
          request.headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; Legal Research Bot; +https://ohlaw.com)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://statutes.capitol.texas.gov/',
            ...request.headers
          }
        }
      ]
    }
    
    return new CheerioCrawler(crawlerOptions)
  }

  /**
   * Parse Texas statutes - would use Texas-specific parser
   * Texas has a different structure from Colorado (codes vs titles)
   */
  async parseStatutes(html: string, url: string): Promise<ParsedStatute[]> {
    try {
      const { load } = await import('cheerio')
      const $ = load(html)
      
      // TODO: Implement Texas-specific parsing logic
      // Texas organizes by "Codes" (e.g., Business & Commerce Code)
      // rather than numbered titles like Colorado
      
      this.log('Texas parsing not yet implemented - placeholder')
      
      // For now, return empty array
      // In a real implementation, this would use a TexasParser similar to ColoradoParser
      return []
      
    } catch (error) {
      this.log(`Error parsing Texas statutes from ${url}:`, error)
      throw error
    }
  }

  /**
   * Texas-specific URL validation
   */
  private isValidTexasUrl(url: string): boolean {
    return url.includes('capitol.texas.gov') || url.includes('statutes.capitol.texas.gov')
  }
}

/**
 * Factory function to create Texas crawler
 */
export function createTexasCrawler(db: StatuteDatabase, config: CrawlerConfig): TexasCrawler {
  return new TexasCrawler(db, config)
}