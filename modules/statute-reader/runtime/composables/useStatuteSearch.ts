import type { 
  SearchQuery, 
  SearchResponse, 
  SearchResult, 
  AutocompleteResponse,
  SearchApiResponse,
  AutocompleteApiResponse 
} from '../types'

export const useStatuteSearch = () => {
  // Reactive search state
  const searchQuery = ref<string>('')
  const searchResults = ref<SearchResult[]>([])
  const isSearching = ref(false)
  const searchError = ref<string | null>(null)
  const totalResults = ref(0)
  const searchTime = ref(0)
  const currentPage = ref(1)
  const resultsPerPage = ref(20)
  
  // Search filters
  const filters = ref({
    jurisdictionId: null as number | null,
    publicationId: null as number | null,
    unitTypes: [] as string[],
    exactMatch: false,
    includeRepealed: false
  })

  // Suggestions and autocomplete
  const suggestions = ref<string[]>([])
  const autocompleteResults = ref<any[]>([])
  const isAutocompleting = ref(false)

  // Search history
  const searchHistory = useLocalStorage<string[]>('statute-search-history', [])

  // Core search function
  const performSearch = async (
    query: string,
    options: Partial<SearchQuery> = {}
  ): Promise<SearchResponse | null> => {
    if (!query || query.trim().length === 0) {
      searchResults.value = []
      totalResults.value = 0
      return null
    }

    isSearching.value = true
    searchError.value = null

    try {
      const searchRequest: SearchQuery = {
        query: query.trim(),
        jurisdiction_id: options.jurisdiction_id || filters.value.jurisdictionId || undefined,
        publication_id: options.publication_id || filters.value.publicationId || undefined,
        unit_types: options.unit_types || filters.value.unitTypes.length ? filters.value.unitTypes : undefined,
        exact_match: options.exact_match ?? filters.value.exactMatch,
        include_repealed: options.include_repealed ?? filters.value.includeRepealed,
        limit: options.limit || resultsPerPage.value,
        offset: options.offset || ((currentPage.value - 1) * resultsPerPage.value)
      }

      const response = await $fetch<SearchApiResponse>('/api/statutes/search', {
        method: 'POST',
        body: searchRequest
      })

      if (response.success && response.data) {
        searchResults.value = response.data.results
        totalResults.value = response.data.total_count
        searchTime.value = response.data.search_time_ms
        suggestions.value = response.data.suggestions || []
        
        // Add to search history if it's a meaningful search
        if (query.length > 2 && !searchHistory.value.includes(query)) {
          searchHistory.value.unshift(query)
          searchHistory.value = searchHistory.value.slice(0, 10) // Keep last 10 searches
        }
        
        return response.data
      }
      
      return null
    } catch (error: any) {
      console.error('Search error:', error)
      searchError.value = error.data?.message || 'Search failed'
      searchResults.value = []
      totalResults.value = 0
      return null
    } finally {
      isSearching.value = false
    }
  }

  // Reactive search with debouncing
  const debouncedSearch = useDebounceFn(async (query: string) => {
    if (query.length >= 2) {
      await performSearch(query)
    } else {
      searchResults.value = []
      totalResults.value = 0
    }
  }, 300)

  // Watch for search query changes
  watch(searchQuery, (newQuery) => {
    debouncedSearch(newQuery)
  })

  // Watch for filter changes
  watch(filters, () => {
    if (searchQuery.value) {
      performSearch(searchQuery.value)
    }
  }, { deep: true })

  // Autocomplete functionality
  const performAutocomplete = async (query: string): Promise<any[]> => {
    if (!query || query.length < 2) {
      autocompleteResults.value = []
      return []
    }

    isAutocompleting.value = true

    try {
      const response = await $fetch<AutocompleteApiResponse>('/api/statutes/autocomplete', {
        query: {
          query,
          jurisdiction_id: filters.value.jurisdictionId,
          limit: 10
        }
      })

      if (response.success && response.data) {
        autocompleteResults.value = response.data.results
        return response.data.results
      }
      
      return []
    } catch (error) {
      console.error('Autocomplete error:', error)
      return []
    } finally {
      isAutocompleting.value = false
    }
  }

  const debouncedAutocomplete = useDebounceFn(performAutocomplete, 200)

  // Pagination
  const totalPages = computed(() => 
    Math.ceil(totalResults.value / resultsPerPage.value)
  )

  const hasNextPage = computed(() => 
    currentPage.value < totalPages.value
  )

  const hasPreviousPage = computed(() => 
    currentPage.value > 1
  )

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      if (searchQuery.value) {
        await performSearch(searchQuery.value)
      }
    }
  }

  const nextPage = async () => {
    if (hasNextPage.value) {
      await goToPage(currentPage.value + 1)
    }
  }

  const previousPage = async () => {
    if (hasPreviousPage.value) {
      await goToPage(currentPage.value - 1)
    }
  }

  // Search utilities
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    totalResults.value = 0
    searchError.value = null
    currentPage.value = 1
    suggestions.value = []
  }

  const clearFilters = () => {
    filters.value = {
      jurisdictionId: null,
      publicationId: null,
      unitTypes: [],
      exactMatch: false,
      includeRepealed: false
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    currentPage.value = 1
  }

  const searchFromHistory = (query: string) => {
    setSearchQuery(query)
  }

  const removeFromHistory = (query: string) => {
    const index = searchHistory.value.indexOf(query)
    if (index > -1) {
      searchHistory.value.splice(index, 1)
    }
  }

  const clearHistory = () => {
    searchHistory.value = []
  }

  // Search result utilities
  const highlightSearchTerms = (text: string, query: string): string => {
    if (!query || !text) return text
    
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  const getResultSnippet = (result: SearchResult): string => {
    return result.snippet || result.unit.content_text?.substring(0, 200) || ''
  }

  const getResultScore = (result: SearchResult): string => {
    return `${Math.round(result.score)}%`
  }

  // Utility function to escape regex special characters
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  return {
    // Reactive state
    searchQuery,
    searchResults: readonly(searchResults),
    isSearching: readonly(isSearching),
    searchError: readonly(searchError),
    totalResults: readonly(totalResults),
    searchTime: readonly(searchTime),
    currentPage,
    resultsPerPage,
    filters,
    suggestions: readonly(suggestions),
    autocompleteResults: readonly(autocompleteResults),
    isAutocompleting: readonly(isAutocompleting),
    searchHistory: readonly(searchHistory),

    // Computed
    totalPages,
    hasNextPage,
    hasPreviousPage,

    // Search functions
    performSearch,
    performAutocomplete: debouncedAutocomplete,
    clearSearch,
    clearFilters,
    setSearchQuery,

    // Pagination
    goToPage,
    nextPage,
    previousPage,

    // History management
    searchFromHistory,
    removeFromHistory,
    clearHistory,

    // Utilities
    highlightSearchTerms,
    getResultSnippet,
    getResultScore
  }
}

// Helper function to escape regex
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}