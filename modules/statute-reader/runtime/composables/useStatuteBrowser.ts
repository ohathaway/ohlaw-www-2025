import type { 
  LegalUnit, 
  BrowseNode, 
  BrowseResponse,
  BrowseApiResponse 
} from '../types'

export const useStatuteBrowser = () => {
  // Reactive state for browsing
  const currentUnit = ref<LegalUnit | null>(null)
  const browseTree = ref<BrowseNode[]>([])
  const breadcrumbs = ref<LegalUnit[]>([])
  const isLoading = ref(false)
  const browserError = ref<string | null>(null)
  
  // Browser configuration
  const includeChildren = ref(true)
  const maxDepth = ref(2)
  const selectedJurisdiction = ref<number | null>(null)
  const selectedPublication = ref<number | null>(null)

  // Navigation history
  const navigationHistory = ref<LegalUnit[]>([])
  const currentHistoryIndex = ref(-1)

  // Core browsing function
  const browseHierarchy = async (
    parentId?: number,
    options: {
      jurisdictionId?: number
      publicationId?: number
      unitType?: string
      level?: number
      includeChildren?: boolean
      maxDepth?: number
    } = {}
  ): Promise<BrowseResponse | null> => {
    isLoading.value = true
    browserError.value = null

    try {
      const query = new URLSearchParams()
      
      if (options.jurisdictionId || selectedJurisdiction.value) {
        query.set('jurisdiction_id', String(options.jurisdictionId || selectedJurisdiction.value))
      }
      
      if (options.publicationId || selectedPublication.value) {
        query.set('publication_id', String(options.publicationId || selectedPublication.value))
      }
      
      if (parentId) {
        query.set('parent_id', String(parentId))
      }
      
      if (options.unitType) {
        query.set('unit_type', options.unitType)
      }
      
      if (options.level) {
        query.set('level', String(options.level))
      }
      
      query.set('include_children', String(options.includeChildren ?? includeChildren.value))
      query.set('max_depth', String(options.maxDepth ?? maxDepth.value))

      const response = await $fetch<BrowseApiResponse>(`/api/statutes/browse?${query}`)

      if (response.success && response.data) {
        browseTree.value = response.data.nodes
        breadcrumbs.value = response.data.breadcrumbs
        return response.data
      }
      
      return null
    } catch (error: any) {
      console.error('Browse error:', error)
      browserError.value = error.data?.message || 'Failed to load statute hierarchy'
      browseTree.value = []
      breadcrumbs.value = []
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Navigate to a specific unit
  const navigateToUnit = async (unit: LegalUnit) => {
    // Add to navigation history
    if (currentUnit.value && 
        (navigationHistory.value.length === 0 || 
         navigationHistory.value[currentHistoryIndex.value]?.id !== currentUnit.value.id)) {
      
      // Remove any forward history when navigating to a new location
      navigationHistory.value = navigationHistory.value.slice(0, currentHistoryIndex.value + 1)
      navigationHistory.value.push(currentUnit.value)
      currentHistoryIndex.value = navigationHistory.value.length - 1
    }

    currentUnit.value = unit
    
    // Load the hierarchy for this unit
    await browseHierarchy(unit.id)
  }

  // Navigate to parent unit
  const navigateToParent = async () => {
    if (currentUnit.value?.parent_id) {
      const { useStatuteData } = await import('./useStatuteData')
      const { fetchStatute } = useStatuteData()
      
      const parent = await fetchStatute(String(currentUnit.value.parent_id))
      if (parent) {
        await navigateToUnit(parent)
      }
    }
  }

  // Navigate to root level
  const navigateToRoot = async () => {
    currentUnit.value = null
    await browseHierarchy()
  }

  // Expand/collapse node functionality
  const expandedNodes = ref<Set<number>>(new Set())

  const toggleNode = async (nodeId: number) => {
    if (expandedNodes.value.has(nodeId)) {
      expandedNodes.value.delete(nodeId)
    } else {
      expandedNodes.value.add(nodeId)
      
      // Load children if not already loaded
      const node = findNodeById(nodeId, browseTree.value)
      if (node && node.children.length === 0 && node.has_more_children) {
        await loadNodeChildren(nodeId)
      }
    }
  }

  const isNodeExpanded = (nodeId: number): boolean => {
    return expandedNodes.value.has(nodeId)
  }

  const expandNode = async (nodeId: number) => {
    if (!expandedNodes.value.has(nodeId)) {
      await toggleNode(nodeId)
    }
  }

  const collapseNode = (nodeId: number) => {
    expandedNodes.value.delete(nodeId)
  }

  const collapseAll = () => {
    expandedNodes.value.clear()
  }

  const expandAll = async () => {
    const collectNodeIds = (nodes: BrowseNode[]): number[] => {
      const ids: number[] = []
      for (const node of nodes) {
        ids.push(node.unit.id)
        if (node.children.length > 0) {
          ids.push(...collectNodeIds(node.children))
        }
      }
      return ids
    }

    const nodeIds = collectNodeIds(browseTree.value)
    for (const id of nodeIds) {
      expandedNodes.value.add(id)
    }
  }

  // Load children for a specific node
  const loadNodeChildren = async (nodeId: number) => {
    const node = findNodeById(nodeId, browseTree.value)
    if (!node) return

    try {
      const response = await browseHierarchy(nodeId, {
        includeChildren: true,
        maxDepth: 1
      })

      if (response) {
        node.children = response.nodes
        node.has_more_children = response.nodes.some(child => child.has_more_children)
      }
    } catch (error) {
      console.error('Failed to load node children:', error)
    }
  }

  // Utility function to find a node by ID
  const findNodeById = (id: number, nodes: BrowseNode[]): BrowseNode | null => {
    for (const node of nodes) {
      if (node.unit.id === id) {
        return node
      }
      
      const found = findNodeById(id, node.children)
      if (found) {
        return found
      }
    }
    return null
  }

  // Navigation history functions
  const canGoBack = computed(() => 
    currentHistoryIndex.value > 0
  )

  const canGoForward = computed(() => 
    currentHistoryIndex.value < navigationHistory.value.length - 1
  )

  const goBack = async () => {
    if (canGoBack.value) {
      currentHistoryIndex.value--
      const previousUnit = navigationHistory.value[currentHistoryIndex.value]
      currentUnit.value = previousUnit
      await browseHierarchy(previousUnit.id)
    }
  }

  const goForward = async () => {
    if (canGoForward.value) {
      currentHistoryIndex.value++
      const nextUnit = navigationHistory.value[currentHistoryIndex.value]
      currentUnit.value = nextUnit
      await browseHierarchy(nextUnit.id)
    }
  }

  const clearHistory = () => {
    navigationHistory.value = []
    currentHistoryIndex.value = -1
  }

  // Filter and search within browse tree
  const treeFilter = ref('')
  const filteredTree = computed(() => {
    if (!treeFilter.value) {
      return browseTree.value
    }

    const filterNodes = (nodes: BrowseNode[]): BrowseNode[] => {
      return nodes.filter(node => {
        const matchesFilter = 
          node.unit.citation.toLowerCase().includes(treeFilter.value.toLowerCase()) ||
          node.unit.name?.toLowerCase().includes(treeFilter.value.toLowerCase())
        
        const filteredChildren = filterNodes(node.children)
        
        return matchesFilter || filteredChildren.length > 0
      }).map(node => ({
        ...node,
        children: filterNodes(node.children)
      }))
    }

    return filterNodes(browseTree.value)
  })

  // Utility functions
  const getUnitDisplayName = (unit: LegalUnit): string => {
    if (unit.name) {
      return `${unit.citation} - ${unit.name}`
    }
    return unit.citation
  }

  const getUnitTypeIcon = (unitType: string): string => {
    const iconMap: Record<string, string> = {
      title: 'pi-book',
      article: 'pi-list',
      section: 'pi-file-o',
      subsection: 'pi-angle-right',
      paragraph: 'pi-minus'
    }
    return iconMap[unitType] || 'pi-file'
  }

  const getTreeDepth = (nodes: BrowseNode[], depth = 0): number => {
    let maxDepth = depth
    for (const node of nodes) {
      if (node.children.length > 0) {
        maxDepth = Math.max(maxDepth, getTreeDepth(node.children, depth + 1))
      }
    }
    return maxDepth
  }

  // Watch for configuration changes
  watch([selectedJurisdiction, selectedPublication], () => {
    if (!currentUnit.value) {
      browseHierarchy()
    }
  })

  return {
    // Reactive state
    currentUnit: readonly(currentUnit),
    browseTree: readonly(filteredTree),
    breadcrumbs: readonly(breadcrumbs),
    isLoading: readonly(isLoading),
    browserError: readonly(browserError),
    
    // Configuration
    includeChildren,
    maxDepth,
    selectedJurisdiction,
    selectedPublication,
    
    // Tree filtering
    treeFilter,
    
    // Navigation functions
    browseHierarchy,
    navigateToUnit,
    navigateToParent,
    navigateToRoot,
    
    // Node expansion
    toggleNode,
    isNodeExpanded,
    expandNode,
    collapseNode,
    collapseAll,
    expandAll,
    loadNodeChildren,
    
    // History navigation
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    clearHistory,
    navigationHistory: readonly(navigationHistory),
    
    // Utilities
    getUnitDisplayName,
    getUnitTypeIcon,
    getTreeDepth,
    findNodeById
  }
}