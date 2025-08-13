import { createStatuteDatabase } from '../../utils'
import type { SystemStatus, ApiResponse } from '../../../types'

export default defineEventHandler(async (event): Promise<ApiResponse<SystemStatus>> => {
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

    const statuteDb = createStatuteDatabase(db)

    // Check database connectivity and gather stats
    const status: SystemStatus = {
      database: {
        connected: false,
        tables_exist: false,
        record_counts: {}
      },
      search: {
        fts_enabled: false,
        vector_enabled: false,
        index_size: 0
      },
      cache: {
        enabled: false,
        hit_rate: 0,
        size: 0
      },
      scraper: {
        status: 'idle'
      }
    }

    try {
      // Test database connection with a simple query
      await db.prepare('SELECT 1').first()
      status.database.connected = true

      // Check if main tables exist
      const tables = await db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name IN (
          'jurisdictions', 'publications', 'legal_units', 
          'legal_units_fts', 'cross_references'
        )
      `).all()
      
      status.database.tables_exist = tables.results.length >= 4

      if (status.database.tables_exist) {
        // Get record counts for each table
        const tableCounts = await Promise.all([
          db.prepare('SELECT COUNT(*) as count FROM jurisdictions').first(),
          db.prepare('SELECT COUNT(*) as count FROM publications').first(),
          db.prepare('SELECT COUNT(*) as count FROM legal_units').first(),
          db.prepare('SELECT COUNT(*) as count FROM cross_references').first()
        ])

        status.database.record_counts = {
          jurisdictions: (tableCounts[0] as any)?.count || 0,
          publications: (tableCounts[1] as any)?.count || 0,
          legal_units: (tableCounts[2] as any)?.count || 0,
          cross_references: (tableCounts[3] as any)?.count || 0
        }

        // Check FTS status
        try {
          const ftsCheck = await db.prepare('SELECT COUNT(*) as count FROM legal_units_fts').first()
          status.search.fts_enabled = true
          status.search.index_size = (ftsCheck as any)?.count || 0
        } catch {
          status.search.fts_enabled = false
        }

        // Check for active legal units
        const activeUnits = await db.prepare(
          'SELECT COUNT(*) as count FROM legal_units WHERE status = "active"'
        ).first()
        
        status.database.record_counts.active_units = (activeUnits as any)?.count || 0
      }

    } catch (error) {
      console.error('Database status check failed:', error)
      status.database.connected = false
    }

    // Check search capabilities
    // Vector search would be checked here if implemented with Cloudflare Vectorize
    status.search.vector_enabled = false // TODO: Implement vector search check

    // Cache status (would integrate with actual cache implementation)
    status.cache.enabled = true // Assume Cloudflare caching is available
    status.cache.hit_rate = 0.85 // Placeholder - would come from actual metrics
    status.cache.size = status.database.record_counts.legal_units || 0

    // Scraper status
    // TODO: Implement actual scraper job tracking
    status.scraper.status = 'idle'
    status.scraper.last_run = undefined
    status.scraper.next_scheduled = undefined

    return {
      success: true,
      data: status,
      meta: {
        request_id: event.node.req.headers['x-request-id'] as string,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error: any) {
    console.error('Status API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve system status',
      data: {
        error: error.message
      }
    })
  }
})