import { CheerioCrawler, type CheerioCrawlerOptions } from 'crawlee'
import { BaseCrawler, type CrawlerConfig, type ParsedStatute } from './base'
import { ColoradoParser } from '../parsers/colorado'
import type { StatuteDatabase } from '../database'

export class ColoradoCrawler extends BaseCrawler {
  
  constructor(db: StatuteDatabase, config: CrawlerConfig) {
    super(db, config)
  }

  /**
   * Discover Colorado title URLs based on crawl type
   */
  async discoverUrls(): Promise<string[]> {
    const crawlType = this.config.crawlType || 'full'
    
    // If crawl_type is 'title', use the source URL directly
    if (crawlType === 'title') {
      this.log(`Single title mode: using source URL directly: ${this.config.sourceUrl}`)
      return [this.config.sourceUrl]
    }
    
    // Full crawl mode - discover all title URLs
    const urls: string[] = []
    
    try {
      this.log('Full crawl mode: discovering title URLs from download page')
      
      // For Colorado, we need to discover individual title files
      // The source URL should point to the download page with title links
      const response = await fetch(this.config.sourceUrl)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${this.config.sourceUrl}: ${response.statusText}`)
      }
      
      const html = await response.text()
      
      // Use Cheerio to parse the download page and find title links
      const { load } = await import('cheerio')
      const $ = load(html)
      
      // Look for links to title files (Title-01.html, Title-02.html, etc.)
      $('a[href*="Title-"], a[href*="title-"], a[href*="crs"]').each((_, element) => {
        const href = $(element).attr('href')
        const linkText = $(element).text()
        
        if (href) {
          // Convert relative URLs to absolute
          const url = href.startsWith('http') ? href : new URL(href, this.config.sourceUrl).toString()
          
          this.log(`Found link: "${linkText}" -> ${url}`)
          
          // Filter for title files with various patterns
          if (url.match(/Title-\d+\.html?$/i) || url.match(/crs\d+-title-\d+\.html?$/i) || url.match(/title-\d+\.html?$/i)) {
            urls.push(url)
            this.log(`Added URL: ${url}`)
          }
        }
      })
      
      // If no URLs found, try alternative patterns
      if (urls.length === 0) {
        this.log('No title URLs found with standard pattern, trying alternatives...')
        
        // Look for any links containing "title" or numbers
        $('a[href]').each((_, element) => {
          const href = $(element).attr('href')
          const text = $(element).text().toLowerCase()
          
          if (href && (text.includes('title') || /title.*\d+/i.test(text))) {
            const url = href.startsWith('http') ? href : new URL(href, this.config.sourceUrl).toString()
            if (url.match(/\.html?$/i)) {
              urls.push(url)
            }
          }
        })
      }
      
      // If still no URLs, use known working URLs for testing
      if (urls.length === 0) {
        this.log('No URLs discovered from page, using known Colorado URLs for testing...')
        
        // Use known working URLs from olls.info
        const knownUrls = [
          'https://olls.info/crs/crs2024-title-43.htm',
          'https://olls.info/crs/crs2024-title-15.htm',
          'https://olls.info/crs/crs2024-title-1.htm'
        ]
        
        urls.push(...knownUrls.slice(0, this.config.batchSize || 3))
        this.log(`Using ${urls.length} known test URLs`)
      }
      
      this.log(`Discovered ${urls.length} potential title URLs`)
      return urls.slice(0, this.config.batchSize || 50) // Limit batch size
      
    } catch (error) {
      this.log('Error discovering URLs:', error)
      throw error
    }
  }

  /**
   * Create Crawlee crawler configured for Colorado statutes
   */
  createCrawler(): CheerioCrawler {
    const crawlerOptions: CheerioCrawlerOptions = {
      requestHandler: async ({ $, request, log }) => {
        this.stats.urlsProcessed++
        
        try {
          this.log(`=== REQUEST HANDLER CALLED FOR ${request.url} ===`)
          this.log(`HTML length: ${$.html().length}`)
          this.log(`Page title: ${$('title').text()}`)
          
          // Parse the statute HTML using Colorado-specific parser
          const statutes = await this.parseStatutes($.html(), request.url)
          
          this.log(`=== PARSING COMPLETE: ${statutes.length} statutes found ===`)
          
          if (statutes.length > 0) {
            this.log(`Parsed ${statutes.length} statutes from ${request.url}`)
            
            // Save to database
            await this.saveStatutes(statutes)
            this.log(`=== SAVE COMPLETE ===`)
          } else {
            this.log(`!!! NO STATUTES FOUND IN ${request.url} !!!`)
          }
          
        } catch (error) {
          this.stats.errors++
          this.log(`!!! ERROR PROCESSING ${request.url}:`, error)
          throw error
        }
      },
      
      failedRequestHandler: ({ request, error, log }) => {
        this.stats.errors++
        this.log(`Request failed: ${request.url}`, { error: error.message })
      },
      
      // Crawlee configuration
      maxRequestRetries: 3,
      requestHandlerTimeoutSecs: 30,
      maxConcurrency: 2, // Be respectful to Colorado's servers
      
      // Request configuration
      additionalMimeTypes: ['text/html'],
      ignoreSslErrors: false,
      
      // Headers to appear more like a regular browser
      preNavigationHooks: [
        async ({ request }) => {
          request.headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; Legal Research Bot; +https://ohlaw.com)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            ...request.headers
          }
        }
      ]
    }
    
    return new CheerioCrawler(crawlerOptions)
  }

  /**
   * Parse statutes using Colorado-specific parser
   */
  async parseStatutes(html: string, url: string): Promise<ParsedStatute[]> {
    try {
      const { load } = await import('cheerio')
      const $ = load(html)
      
      // Use Colorado parser to extract statute structure
      const statutes = ColoradoParser.parseStatutes($, url)
      
      // Filter out invalid statutes
      return statutes.filter(statute => {
        if (!statute.citation) {
          this.log(`Skipping statute without citation: ${statute.name}`)
          return false
        }
        
        if (!ColoradoParser.isValidColoradoCitation(statute.citation)) {
          this.log(`Skipping statute with invalid citation: ${statute.citation}`)
          return false
        }
        
        return true
      })
      
    } catch (error) {
      this.log(`Error parsing statutes from ${url}:`, error)
      throw error
    }
  }

  /**
   * Colorado-specific URL validation
   */
  private isValidColoradoUrl(url: string): boolean {
    return url.includes('leg.colorado.gov') && url.match(/Title-\d+\.html?$/i) !== null
  }
}

/**
 * Factory function to create Colorado crawler
 */
export function createColoradoCrawler(db: StatuteDatabase, config: CrawlerConfig): ColoradoCrawler {
  return new ColoradoCrawler(db, config)
}