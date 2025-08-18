import { createStatuteDatabase } from '../../utils/database'
import type { StatuteApiResponse, LegalUnit } from '../../../types'

export default defineEventHandler(async (event): Promise<StatuteApiResponse> => {
  try {

    // Extract citation from route parameters
    // With the new route pattern '/api/statutes/citations/*', the citation comes from the wildcard
    let citation = getRouterParam(event, 'citation')
    
    // If no citation parameter, try to extract from the URL path
    if (!citation) {
      const url = getRequestURL(event)
      const pathParts = url.pathname.split('/')
      const citationsIndex = pathParts.indexOf('citations')
      if (citationsIndex !== -1 && pathParts[citationsIndex + 1]) {
        citation = pathParts.slice(citationsIndex + 1).join('/')
      }
    }
    
    if (!citation) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Citation parameter is required'
      })
    }

    // Decode and clean the citation
    const decodedCitation = decodeURIComponent(citation)
    const cleanCitation = decodedCitation.replace(/^\//, '') // Remove leading slash if present

    // Parse query parameters for additional options
    const query = getQuery(event)
    const includeChildren = query.include_children === 'true'
    const includeRelated = query.include_related === 'true'
    const includeHistory = query.include_history === 'true'
    const includeMetadata = query.include_metadata === 'true'

    const statuteDb = createStatuteDatabase()

    // Get the main legal unit
    const unit = await statuteDb.getLegalUnitByCitation(cleanCitation)
    if (!unit) {
      throw createError({
        statusCode: 404,
        statusMessage: `Statute not found: ${cleanCitation}`
      })
    }

    // Enhance the unit with additional data if requested
    const enhancedUnit: LegalUnit & {
      children?: LegalUnit[]
      cross_references?: any[]
      history?: any[]
      metadata?: any[]
      parent?: LegalUnit
    } = { ...unit }

    // Include children if requested
    if (includeChildren) {
      enhancedUnit.children = await statuteDb.getLegalUnitChildren(unit.id)
    }

    // Include parent information
    if (unit.parent_id) {
      enhancedUnit.parent = await statuteDb.getLegalUnitParent(unit.id)
    }

    // Include cross-references if requested
    if (includeRelated) {
      enhancedUnit.cross_references = await statuteDb.getCrossReferences(unit.id)
    }

    // Include history if requested
    if (includeHistory) {
      enhancedUnit.history = await statuteDb.getUnitHistory(unit.id)
    }

    // Include metadata if requested
    if (includeMetadata) {
      enhancedUnit.metadata = await statuteDb.getUnitMetadata(unit.id)
    }

    return {
      success: true,
      data: enhancedUnit,
      meta: {
        request_id: event.node.req.headers['x-request-id'] as string,
        cache_hit: false,
        citation: cleanCitation,
        include_children: includeChildren,
        include_related: includeRelated,
        include_history: includeHistory,
        include_metadata: includeMetadata
      }
    }
  } catch (error: any) {
    console.error('Statute API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error retrieving statute',
      data: {
        error: error.message,
        citation: getRouterParam(event, 'citation')
      }
    })
  }
})