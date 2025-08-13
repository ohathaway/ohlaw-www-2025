import type { SearchResponse, BrowseResponse, AutocompleteResponse } from './search'
import type { LegalUnit, Publication, Jurisdiction } from './statute'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ApiMeta
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

export interface ApiMeta {
  page?: number
  limit?: number
  total?: number
  has_more?: boolean
  request_id?: string
  cache_hit?: boolean
}

export interface StatuteApiResponse extends ApiResponse<LegalUnit> {}
export interface StatutesApiResponse extends ApiResponse<LegalUnit[]> {}
export interface SearchApiResponse extends ApiResponse<SearchResponse> {}
export interface BrowseApiResponse extends ApiResponse<BrowseResponse> {}
export interface AutocompleteApiResponse extends ApiResponse<AutocompleteResponse> {}
export interface PublicationsApiResponse extends ApiResponse<Publication[]> {}
export interface JurisdictionsApiResponse extends ApiResponse<Jurisdiction[]> {}

export interface ScrapeRequest {
  jurisdiction: string
  source_url: string
  force_refresh?: boolean
  dry_run?: boolean
}

export interface ScrapeResponse {
  success: boolean
  message: string
  stats: {
    titles_processed: number
    articles_processed: number
    sections_processed: number
    errors: number
    duration_ms: number
  }
  errors?: string[]
}

export interface SystemStatus {
  database: {
    connected: boolean
    tables_exist: boolean
    record_counts: Record<string, number>
  }
  search: {
    fts_enabled: boolean
    vector_enabled: boolean
    index_size: number
  }
  cache: {
    enabled: boolean
    hit_rate: number
    size: number
  }
  scraper: {
    last_run?: string
    status: 'idle' | 'running' | 'error'
    next_scheduled?: string
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestOptions {
  method?: HttpMethod
  headers?: Record<string, string>
  query?: Record<string, any>
  body?: any
  timeout?: number
  retry?: number
}

export interface PaginationOptions {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}