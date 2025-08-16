import type { 
  LegalUnit, 
  Publication, 
  Jurisdiction,
  StatuteApiResponse,
  PublicationsApiResponse,
  JurisdictionsApiResponse 
} from '../types'

export const useStatuteData = () => {
  // Core data fetching functions
  const fetchStatute = async (
    citation: string, 
    options: {
      includeChildren?: boolean
      includeRelated?: boolean
      includeHistory?: boolean
      includeMetadata?: boolean
    } = {}
  ): Promise<LegalUnit | null> => {
    try {
      const query = new URLSearchParams()
      if (options.includeChildren) query.set('include_children', 'true')
      if (options.includeRelated) query.set('include_related', 'true')
      if (options.includeHistory) query.set('include_history', 'true')
      if (options.includeMetadata) query.set('include_metadata', 'true')

      const url = `/api/statutes/${encodeURIComponent(citation)}${query.toString() ? `?${query}` : ''}`
      const response = await $fetch<StatuteApiResponse>(url)
      
      if (response.success && response.data) {
        return response.data
      }
      
      return null
    } catch (error) {
      console.error('Error fetching statute:', error)
      return null
    }
  }

  const fetchPublications = async (jurisdictionId?: number): Promise<Publication[]> => {
    try {
      const query = jurisdictionId ? `?jurisdiction_id=${jurisdictionId}` : ''
      const response = await $fetch<PublicationsApiResponse>(`/api/statutes/publications${query}`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      return []
    } catch (error) {
      console.error('Error fetching publications:', error)
      return []
    }
  }

  const fetchJurisdictions = async (): Promise<Jurisdiction[]> => {
    try {
      const response = await $fetch<JurisdictionsApiResponse>('/api/statutes/jurisdictions')
      
      if (response.success && response.data) {
        return response.data
      }
      
      return []
    } catch (error) {
      console.error('Error fetching jurisdictions:', error)
      return []
    }
  }

  // Reactive composables with caching
  const useStatute = (citation: Ref<string> | string, options: Ref<any> | any = {}) => {
    const citationRef = isRef(citation) ? citation : ref(citation)
    const optionsRef = isRef(options) ? options : ref(options)
    
    const { data: statute, pending, error, refresh } = useLazyAsyncData(
      `statute:${citationRef.value}`,
      () => fetchStatute(citationRef.value, optionsRef.value),
      {
        watch: [citationRef, optionsRef],
        default: () => null
      }
    )

    return {
      statute: readonly(statute),
      pending: readonly(pending),
      error: readonly(error),
      refresh
    }
  }

  const usePublications = (jurisdictionId?: Ref<number> | number) => {
    const jurisdictionIdRef = jurisdictionId 
      ? (isRef(jurisdictionId) ? jurisdictionId : ref(jurisdictionId))
      : ref(undefined)
    
    const { data: publications, pending, error, refresh } = useLazyAsyncData(
      'publications',
      () => fetchPublications(jurisdictionIdRef.value),
      {
        watch: [jurisdictionIdRef],
        default: () => []
      }
    )

    return {
      publications: readonly(publications),
      pending: readonly(pending),
      error: readonly(error),
      refresh
    }
  }

  const useJurisdictions = () => {
    const { data: jurisdictions, pending, error, refresh } = useLazyAsyncData(
      'jurisdictions',
      () => fetchJurisdictions(),
      {
        default: () => []
      }
    )

    return {
      jurisdictions: readonly(jurisdictions),
      pending: readonly(pending),
      error: readonly(error),
      refresh
    }
  }

  // Utility functions
  const formatCitation = (unit: LegalUnit): string => {
    return unit.citation || ''
  }

  const getStatuteUrl = (citation: string): string => {
    const { $router } = useNuxtApp()
    const config = useRuntimeConfig()
    const basePath = config.public.statuteReader?.ui?.basePath || '/statutes'
    
    return `${basePath}/${encodeURIComponent(citation)}`
  }

  const navigateToStatute = async (citation: string) => {
    const { $router } = useNuxtApp()
    await $router.push(getStatuteUrl(citation))
  }

  const buildBreadcrumbs = (unit: LegalUnit): { citation: string, name?: string, level: number }[] => {
    const breadcrumbs: { citation: string, name?: string, level: number }[] = []
    
    // Build breadcrumbs from the unit hierarchy
    // This would typically come from the parent chain
    if (unit.parent) {
      breadcrumbs.push(...buildBreadcrumbs(unit.parent))
    }
    
    breadcrumbs.push({
      citation: unit.citation,
      name: unit.name,
      level: unit.level
    })
    
    return breadcrumbs
  }

  const isValidCitation = (citation: string): boolean => {
    if (!citation || citation.trim().length === 0) return false
    
    // Basic validation - could be enhanced with jurisdiction-specific rules
    const citationPattern = /^§?\s*\d+(-\d+)*(\.\d+)*$/
    return citationPattern.test(citation.trim())
  }

  const normalizeCitation = (citation: string): string => {
    return citation
      .trim()
      .replace(/^§\s*/, '') // Remove leading section symbol
      .replace(/\s+/g, '-') // Replace spaces with hyphens
  }

  return {
    // Direct fetch functions
    fetchStatute,
    fetchPublications,
    fetchJurisdictions,
    
    // Reactive composables
    useStatute,
    usePublications,
    useJurisdictions,
    
    // Utility functions
    formatCitation,
    getStatuteUrl,
    navigateToStatute,
    buildBreadcrumbs,
    isValidCitation,
    normalizeCitation
  }
}