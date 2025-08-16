import { createStatuteDatabase } from '../../utils/database'
import type { ApiResponse, Publication } from '../../../types'

export default defineEventHandler(async (event): Promise<ApiResponse<Publication[]>> => {
  try {

    // Parse query parameters
    const query = getQuery(event)
    const jurisdictionId = query.jurisdiction_id ? parseInt(query.jurisdiction_id as string) : undefined

    const statuteDb = createStatuteDatabase()
    const publications = await statuteDb.getPublications(jurisdictionId)

    return {
      success: true,
      data: publications,
      meta: {
        request_id: event.node.req.headers['x-request-id'] as string,
        cache_hit: false,
        total_count: publications.length,
        jurisdiction_id: jurisdictionId
      }
    }
  } catch (error: any) {
    console.error('Publications API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error retrieving publications',
      data: {
        error: error.message
      }
    })
  }
})