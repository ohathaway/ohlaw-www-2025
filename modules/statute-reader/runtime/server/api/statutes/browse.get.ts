import { createStatuteDatabase } from '../../utils/database'
import type { BrowseQuery, BrowseApiResponse, BrowseNode } from '../../../types'

export default defineEventHandler(async (event): Promise<BrowseApiResponse> => {
  try {

    // Parse query parameters
    const query = getQuery(event)
    const browseQuery: BrowseQuery = {
      jurisdiction_id: query.jurisdiction_id ? parseInt(query.jurisdiction_id as string) : undefined,
      publication_id: query.publication_id ? parseInt(query.publication_id as string) : undefined,
      parent_id: query.parent_id ? parseInt(query.parent_id as string) : undefined,
      unit_type: query.unit_type as string,
      level: query.level ? parseInt(query.level as string) : undefined,
      include_children: query.include_children === 'true',
      max_depth: Math.min(parseInt(query.max_depth as string) || 2, 5) // Cap at 5 levels
    }

    const statuteDb = createStatuteDatabase()

    // Get the main units for browsing
    const units = await statuteDb.getBrowseHierarchy(
      browseQuery.publication_id,
      browseQuery.parent_id,
      browseQuery.max_depth
    )

    // Build browse nodes with children if requested
    const nodes: BrowseNode[] = []
    
    for (const unit of units) {
      const node: BrowseNode = {
        unit,
        children: [],
        has_more_children: false,
        child_count: 0
      }

      if (browseQuery.include_children) {
        const children = await statuteDb.getLegalUnitChildren(unit.id)
        node.children = children.map(child => ({
          unit: child,
          children: [],
          has_more_children: false,
          child_count: 0
        }))
        node.child_count = children.length
        
        // Check if there are more children beyond what we loaded
        if (browseQuery.max_depth && browseQuery.max_depth > 1) {
          for (const child of children) {
            const grandchildren = await statuteDb.getLegalUnitChildren(child.id)
            const childNode = node.children.find(c => c.unit.id === child.id)
            if (childNode) {
              childNode.child_count = grandchildren.length
              childNode.has_more_children = grandchildren.length > 0
            }
          }
        }
      } else {
        // Just get count of children
        const children = await statuteDb.getLegalUnitChildren(unit.id)
        node.child_count = children.length
        node.has_more_children = children.length > 0
      }

      nodes.push(node)
    }

    // Get breadcrumbs if we have a specific parent
    let breadcrumbs: any[] = []
    if (browseQuery.parent_id) {
      breadcrumbs = await statuteDb.getBreadcrumbs(browseQuery.parent_id)
    }

    const response = {
      nodes,
      breadcrumbs,
      total_count: nodes.length
    }

    return {
      success: true,
      data: response,
      meta: {
        request_id: event.node.req.headers['x-request-id'] as string,
        cache_hit: false
      }
    }
  } catch (error: any) {
    console.error('Browse API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during browse',
      data: {
        error: error.message
      }
    })
  }
})