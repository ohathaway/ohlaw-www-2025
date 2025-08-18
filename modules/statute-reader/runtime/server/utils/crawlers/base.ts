import type { CheerioCrawler } from 'crawlee'
import type { StatuteDatabase } from '../database'

export interface CrawlerConfig {
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

export interface ParsedStatute {
  unit_type: 'title' | 'article' | 'part' | 'section' | 'subsection'
  level: number
  number?: string
  name?: string
  citation: string
  content_html?: string
  content_text?: string
  parent_citation?: string
  sort_order: number
  metadata?: Record<string, any>
}

export abstract class BaseCrawler {
  protected db: StatuteDatabase
  protected config: CrawlerConfig
  protected stats: ScrapeStats
  protected crawler?: CheerioCrawler

  constructor(db: StatuteDatabase, config: CrawlerConfig) {
    this.db = db
    this.config = config
    this.stats = {
      titlesProcessed: 0,
      articlesProcessed: 0,
      sectionsProcessed: 0,
      errors: 0,
      startTime: Date.now(),
      urlsDiscovered: 0,
      urlsProcessed: 0
    }
  }

  abstract discoverUrls(): Promise<string[]>
  abstract createCrawler(): CheerioCrawler
  abstract parseStatutes(html: string, url: string): Promise<ParsedStatute[]>
  
  async run(): Promise<ScrapeStats> {
    try {
      console.log(`Starting scrape for ${this.config.jurisdiction} from ${this.config.sourceUrl}`)
      
      // Discover URLs to crawl
      const urls = await this.discoverUrls()
      this.stats.urlsDiscovered = urls.length
      console.log(`Discovered ${urls.length} URLs to crawl`)

      // Create and configure crawler
      this.crawler = this.createCrawler()
      
      // Add URLs to crawler
      await this.crawler.addRequests(urls)
      
      // Run crawler
      await this.crawler.run()
      
      this.stats.endTime = Date.now()
      console.log(`Scrape completed. Stats:`, this.stats)
      
      return this.stats
    } catch (error) {
      this.stats.errors++
      this.stats.endTime = Date.now()
      console.error('Crawler error:', error)
      throw error
    }
  }

  protected async saveStatutes(statutes: ParsedStatute[]): Promise<void> {
    const hierarchyMap = new Map<string, number>()
    
    // Sort by level to ensure parents are created before children
    const sortedStatutes = statutes.sort((a, b) => a.level - b.level)
    
    for (const statute of sortedStatutes) {
      try {
        if (this.config.dryRun) {
          console.log(`[DRY RUN] Would create ${statute.unit_type}: ${statute.citation} - ${statute.name}`)
          // Track stats even in dry run
          this.updateStats(statute.unit_type)
          continue
        }

        const parentId = statute.parent_citation ? hierarchyMap.get(statute.parent_citation) : undefined
        
        const unitId = await this.db.createLegalUnit({
          publication_id: this.config.publicationId,
          parent_id: parentId,
          unit_type: statute.unit_type,
          level: statute.level,
          number: statute.number,
          name: statute.name,
          citation: statute.citation,
          content_html: statute.content_html,
          content_text: statute.content_text,
          status: 'active',
          sort_order: statute.sort_order
        })
        
        // Store mapping for children
        hierarchyMap.set(statute.citation, unitId)
        
        this.updateStats(statute.unit_type)
        
      } catch (error) {
        console.error(`Error saving statute ${statute.citation}:`, error)
        this.stats.errors++
      }
    }
  }

  protected updateStats(unitType: string): void {
    switch (unitType) {
      case 'title':
        this.stats.titlesProcessed++
        break
      case 'article':
        this.stats.articlesProcessed++
        break
      case 'section':
      case 'subsection':
        this.stats.sectionsProcessed++
        break
    }
  }

  protected log(message: string, data?: any): void {
    const prefix = `[${this.config.jurisdiction.toUpperCase()}]`
    if (data) {
      console.log(`${prefix} ${message}`, data)
    } else {
      console.log(`${prefix} ${message}`)
    }
  }
}