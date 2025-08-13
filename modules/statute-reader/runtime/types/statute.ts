export interface Jurisdiction {
  id: number
  name: string
  abbreviation: string
  active: boolean
  created_at: string
}

export interface SourceType {
  id: number
  name: string
  abbreviation: string
  created_at: string
}

export interface Publication {
  id: number
  jurisdiction_id: number
  source_type_id: number
  name: string
  abbreviation?: string
  year?: number
  effective_date?: string
  superseded_date?: string
  active: boolean
  created_at: string
  jurisdiction?: Jurisdiction
  source_type?: SourceType
}

export interface JurisdictionHierarchy {
  id: number
  jurisdiction_id: number
  publication_id?: number
  level: number
  unit_type: string
  display_name: string
  citation_format?: string
  created_at: string
}

export interface LegalUnit {
  id: number
  publication_id: number
  parent_id?: number
  unit_type: string
  level: number
  number?: string
  name?: string
  citation: string
  content_html?: string
  content_text?: string
  status: 'active' | 'repealed' | 'superseded'
  effective_date?: string
  last_modified: string
  sort_order: number
  created_at: string
  publication?: Publication
  parent?: LegalUnit
  children?: LegalUnit[]
  cross_references?: CrossReference[]
  metadata?: UnitMetadata[]
  history?: UnitHistory[]
}

export interface CrossReference {
  id: number
  from_unit_id: number
  to_unit_id: number
  reference_text?: string
  context?: string
  created_at: string
  from_unit?: LegalUnit
  to_unit?: LegalUnit
}

export interface UnitHistory {
  id: number
  unit_id: number
  source_citation?: string
  amendment_type?: string
  effective_date?: string
  description?: string
  created_at: string
}

export interface UnitMetadata {
  id: number
  unit_id: number
  metadata_type: string
  content_html?: string
  content_text?: string
  created_at: string
}

export interface StatuteBreadcrumb {
  citation: string
  name?: string
  unit_type: string
  level: number
}

export interface StatuteHierarchyNode {
  unit: LegalUnit
  children: StatuteHierarchyNode[]
  parent?: StatuteHierarchyNode
  depth: number
}

export type UnitType = 'title' | 'article' | 'section' | 'subsection' | 'paragraph' | 'chapter' | 'part' | 'subpart'
export type MetadataType = 'editor_note' | 'source_note' | 'amendment_note' | 'cross_reference_note'
export type AmendmentType = 'added' | 'amended' | 'repealed' | 'renumbered' | 'transferred'