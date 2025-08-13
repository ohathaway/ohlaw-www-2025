import { createStatuteDatabase, createSearchEngine } from '../../utils'
import type { SearchQuery, SearchApiResponse } from '../../../types'

export default defineEventHandler(async (event): Promise<SearchApiResponse> => {
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

    // Parse and validate the search query
    const body = await readBody(event)
    const searchQuery: SearchQuery = {
      query: body.query || '',
      jurisdiction_id: body.jurisdiction_id,
      publication_id: body.publication_id,
      unit_types: body.unit_types,
      level: body.level,
      exact_match: body.exact_match || false,
      include_repealed: body.include_repealed || false,
      limit: Math.min(body.limit || 20, 100), // Cap at 100
      offset: body.offset || 0
    }

    // Validate required fields
    if (!searchQuery.query || searchQuery.query.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Search query is required'
      })
    }

    if (searchQuery.query.length > 500) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Search query too long'
      })
    }

    // Perform the search
    const statuteDb = createStatuteDatabase(db)
    const searchEngine = createSearchEngine(statuteDb)
    const searchResponse = await searchEngine.search(searchQuery)

    return {
      success: true,
      data: searchResponse,
      meta: {
        request_id: event.node.req.headers['x-request-id'] as string,
        cache_hit: false
      }
    }
  } catch (error: any) {
    console.error('Search API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during search',
      data: {
        error: error.message
      }
    })
  }
})