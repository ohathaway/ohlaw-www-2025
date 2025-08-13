import type { LegalUnit } from './statute'

export interface SearchQuery {
  query: string
  jurisdiction_id?: number
  publication_id?: number
  unit_types?: string[]
  level?: number
  exact_match?: boolean
  include_repealed?: boolean
  limit?: number
  offset?: number
}

export interface SearchResult {
  unit: LegalUnit
  score: number
  snippet?: string
  highlight_positions?: HighlightPosition[]
  match_type: 'exact' | 'partial' | 'fuzzy' | 'semantic'
}

export interface HighlightPosition {
  start: number
  end: number
  field: 'citation' | 'name' | 'content_text'
}

export interface SearchResponse {
  results: SearchResult[]
  total_count: number
  query: SearchQuery
  search_time_ms: number
  suggestions?: string[]
}

export interface SearchFilter {
  jurisdiction_ids?: number[]
  publication_ids?: number[]
  unit_types?: string[]
  levels?: number[]
  date_range?: {
    from?: string
    to?: string
  }
  status?: ('active' | 'repealed' | 'superseded')[]
}

export interface BrowseQuery {
  jurisdiction_id?: number
  publication_id?: number
  parent_id?: number
  unit_type?: string
  level?: number
  include_children?: boolean
  max_depth?: number
}

export interface BrowseNode {
  unit: LegalUnit
  children: BrowseNode[]
  has_more_children: boolean
  child_count: number
}

export interface BrowseResponse {
  nodes: BrowseNode[]
  breadcrumbs: LegalUnit[]
  total_count: number
}

export interface AutocompleteQuery {
  query: string
  jurisdiction_id?: number
  publication_id?: number
  limit?: number
}

export interface AutocompleteResult {
  citation: string
  name?: string
  unit_type: string
  match_type: 'citation' | 'name' | 'content'
}

export interface AutocompleteResponse {
  results: AutocompleteResult[]
  query: string
}