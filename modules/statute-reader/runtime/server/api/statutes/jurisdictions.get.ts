import { createStatuteDatabase } from '../../utils/database'
import type { ApiResponse, Jurisdiction } from '../../../types'

export default defineEventHandler(async (event): Promise<ApiResponse<Jurisdiction[]>> => {
  try {

    const statuteDb = createStatuteDatabase()
    const jurisdictions = await statuteDb.getJurisdictions()

    return {
      success: true,
      data: jurisdictions,
      meta: {
        request_id: event.node.req.headers['x-request-id'] as string,
        cache_hit: false,
        total_count: jurisdictions.length
      }
    }
  } catch (error: any) {
    console.error('Jurisdictions API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error retrieving jurisdictions',
      data: {
        error: error.message
      }
    })
  }
})