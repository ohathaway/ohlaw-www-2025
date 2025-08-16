import type { 
  LegalUnit, 
  Jurisdiction, 
  Publication, 
  CrossReference,
  UnitHistory,
  UnitMetadata 
} from '../../types'

export class StatuteDatabase {
  constructor(private db: any) {}

  // Jurisdictions
  async getJurisdictions(): Promise<Jurisdiction[]> {
    const result = await this.db.prepare(`
      SELECT * FROM jurisdictions WHERE active = 1 ORDER BY name
    `).all()
    
    return result.results as Jurisdiction[]
  }

  async getJurisdictionByAbbreviation(abbreviation: string): Promise<Jurisdiction | null> {
    const result = await this.db.prepare(`
      SELECT * FROM jurisdictions WHERE abbreviation = ? AND active = 1
    `).bind(abbreviation).first()
    
    return result as Jurisdiction | null
  }

  // Publications
  async getPublications(jurisdictionId?: number): Promise<Publication[]> {
    let query = `
      SELECT p.*, j.name as jurisdiction_name, j.abbreviation as jurisdiction_abbr,
             st.name as source_type_name, st.abbreviation as source_type_abbr
      FROM publications p
      JOIN jurisdictions j ON p.jurisdiction_id = j.id
      JOIN source_types st ON p.source_type_id = st.id
      WHERE p.active = 1
    `
    
    const params: any[] = []
    if (jurisdictionId) {
      query += ' AND p.jurisdiction_id = ?'
      params.push(jurisdictionId)
    }
    
    query += ' ORDER BY j.name, p.year DESC, p.name'
    
    const result = await this.db.prepare(query).bind(...params).all()
    return result.results as Publication[]
  }

  // Legal Units - Basic operations
  async getLegalUnitByCitation(citation: string): Promise<LegalUnit | null> {
    const result = await this.db.prepare(`
      SELECT lu.*, p.name as publication_name, p.abbreviation as publication_abbr,
             j.name as jurisdiction_name, j.abbreviation as jurisdiction_abbr
      FROM legal_units lu
      JOIN publications p ON lu.publication_id = p.id
      JOIN jurisdictions j ON p.jurisdiction_id = j.id
      WHERE lu.citation = ? AND lu.status = 'active'
    `).bind(citation).first()
    
    return result as LegalUnit | null
  }

  async getLegalUnitById(id: number): Promise<LegalUnit | null> {
    const result = await this.db.prepare(`
      SELECT lu.*, p.name as publication_name, p.abbreviation as publication_abbr,
             j.name as jurisdiction_name, j.abbreviation as jurisdiction_abbr
      FROM legal_units lu
      JOIN publications p ON lu.publication_id = p.id
      JOIN jurisdictions j ON p.jurisdiction_id = j.id
      WHERE lu.id = ?
    `).bind(id).first()
    
    return result as LegalUnit | null
  }

  async getLegalUnitChildren(parentId: number, includeInactive = false): Promise<LegalUnit[]> {
    let query = `
      SELECT lu.*, p.name as publication_name, p.abbreviation as publication_abbr
      FROM legal_units lu
      JOIN publications p ON lu.publication_id = p.id
      WHERE lu.parent_id = ?
    `
    
    if (!includeInactive) {
      query += " AND lu.status = 'active'"
    }
    
    query += ' ORDER BY lu.sort_order, lu.number'
    
    const result = await this.db.prepare(query).bind(parentId).all()
    return result.results as LegalUnit[]
  }

  async getLegalUnitParent(childId: number): Promise<LegalUnit | null> {
    const result = await this.db.prepare(`
      SELECT parent.*, p.name as publication_name, p.abbreviation as publication_abbr
      FROM legal_units child
      JOIN legal_units parent ON child.parent_id = parent.id
      JOIN publications p ON parent.publication_id = p.id
      WHERE child.id = ?
    `).bind(childId).first()
    
    return result as LegalUnit | null
  }

  // Hierarchy and browsing
  async getBrowseHierarchy(
    publicationId?: number,
    parentId?: number,
    maxDepth = 3
  ): Promise<LegalUnit[]> {
    let query = `
      SELECT lu.*, p.name as publication_name, p.abbreviation as publication_abbr
      FROM legal_units lu
      JOIN publications p ON lu.publication_id = p.id
      WHERE lu.status = 'active'
    `
    
    const params: any[] = []
    
    if (parentId) {
      query += ' AND lu.parent_id = ?'
      params.push(parentId)
    } else {
      query += ' AND lu.parent_id IS NULL'
    }
    
    if (publicationId) {
      query += ' AND lu.publication_id = ?'
      params.push(publicationId)
    }
    
    query += ' ORDER BY lu.sort_order, lu.number'
    
    const result = await this.db.prepare(query).bind(...params).all()
    return result.results as LegalUnit[]
  }

  async getBreadcrumbs(unitId: number): Promise<LegalUnit[]> {
    // Recursive CTE to get the full path to root
    const result = await this.db.prepare(`
      WITH RECURSIVE unit_path AS (
        SELECT lu.*, 0 as depth
        FROM legal_units lu
        WHERE lu.id = ?
        
        UNION ALL
        
        SELECT parent.*, up.depth + 1
        FROM legal_units parent
        JOIN unit_path up ON parent.id = up.parent_id
      )
      SELECT * FROM unit_path ORDER BY depth DESC
    `).bind(unitId).all()
    
    return result.results as LegalUnit[]
  }

  // Search operations
  async searchLegalUnits(
    query: string,
    publicationId?: number,
    unitTypes?: string[],
    limit = 20,
    offset = 0
  ): Promise<{ results: LegalUnit[], total: number }> {
    let searchQuery = `
      SELECT lu.*, p.name as publication_name, p.abbreviation as publication_abbr,
             rank as search_rank
      FROM legal_units_fts fts
      JOIN legal_units lu ON fts.rowid = lu.id
      JOIN publications p ON lu.publication_id = p.id
      WHERE legal_units_fts MATCH ?
    `
    
    const params: any[] = [query]
    
    if (publicationId) {
      searchQuery += ' AND lu.publication_id = ?'
      params.push(publicationId)
    }
    
    if (unitTypes?.length) {
      searchQuery += ` AND lu.unit_type IN (${unitTypes.map(() => '?').join(',')})`
      params.push(...unitTypes)
    }
    
    searchQuery += ' AND lu.status = "active"'
    searchQuery += ' ORDER BY rank LIMIT ? OFFSET ?'
    params.push(limit, offset)
    
    const results = await this.db.prepare(searchQuery).bind(...params).all()
    
    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM legal_units_fts fts
      JOIN legal_units lu ON fts.rowid = lu.id
      WHERE legal_units_fts MATCH ?
    `
    
    const countParams: any[] = [query]
    
    if (publicationId) {
      countQuery += ' AND lu.publication_id = ?'
      countParams.push(publicationId)
    }
    
    if (unitTypes?.length) {
      countQuery += ` AND lu.unit_type IN (${unitTypes.map(() => '?').join(',')})`
      countParams.push(...unitTypes)
    }
    
    countQuery += ' AND lu.status = "active"'
    
    const countResult = await this.db.prepare(countQuery).bind(...countParams).first()
    
    return {
      results: results.results as LegalUnit[],
      total: (countResult as any)?.total || 0
    }
  }

  // Related data
  async getCrossReferences(unitId: number): Promise<CrossReference[]> {
    const result = await this.db.prepare(`
      SELECT cr.*, 
             from_unit.citation as from_citation, from_unit.name as from_name,
             to_unit.citation as to_citation, to_unit.name as to_name
      FROM cross_references cr
      JOIN legal_units from_unit ON cr.from_unit_id = from_unit.id
      JOIN legal_units to_unit ON cr.to_unit_id = to_unit.id
      WHERE cr.from_unit_id = ? OR cr.to_unit_id = ?
    `).bind(unitId, unitId).all()
    
    return result.results as CrossReference[]
  }

  async getUnitHistory(unitId: number): Promise<UnitHistory[]> {
    const result = await this.db.prepare(`
      SELECT * FROM unit_history 
      WHERE unit_id = ? 
      ORDER BY effective_date DESC, created_at DESC
    `).bind(unitId).all()
    
    return result.results as UnitHistory[]
  }

  async getUnitMetadata(unitId: number, metadataType?: string): Promise<UnitMetadata[]> {
    let query = 'SELECT * FROM unit_metadata WHERE unit_id = ?'
    const params: any[] = [unitId]
    
    if (metadataType) {
      query += ' AND metadata_type = ?'
      params.push(metadataType)
    }
    
    query += ' ORDER BY metadata_type, created_at'
    
    const result = await this.db.prepare(query).bind(...params).all()
    return result.results as UnitMetadata[]
  }

  // Administrative operations
  async createLegalUnit(unit: Omit<LegalUnit, 'id' | 'created_at' | 'last_modified'>): Promise<number> {
    const result = await this.db.prepare(`
      INSERT INTO legal_units (
        publication_id, parent_id, unit_type, level, number, name, 
        citation, content_html, content_text, status, effective_date, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      unit.publication_id,
      unit.parent_id || null,
      unit.unit_type,
      unit.level,
      unit.number || null,
      unit.name || null,
      unit.citation,
      unit.content_html || null,
      unit.content_text || null,
      unit.status || 'active',
      unit.effective_date || null,
      unit.sort_order
    ).run()
    
    return result.meta.last_row_id as number
  }

  async updateLegalUnit(id: number, updates: Partial<LegalUnit>): Promise<boolean> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'created_at')
      .map(key => `${key} = ?`)
      .join(', ')
    
    if (!setClause) return false
    
    const values = Object.entries(updates)
      .filter(([key]) => key !== 'id' && key !== 'created_at')
      .map(([, value]) => value)
    
    const query = `
      UPDATE legal_units 
      SET ${setClause}, last_modified = CURRENT_TIMESTAMP 
      WHERE id = ?
    `
    
    const result = await this.db.prepare(query).bind(...values, id).run()
    return result.success
  }

  async deleteLegalUnit(id: number): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM legal_units WHERE id = ?').bind(id).run()
    return result.success
  }
}

export const createStatuteDatabase = () => new StatuteDatabase(hubDatabase())