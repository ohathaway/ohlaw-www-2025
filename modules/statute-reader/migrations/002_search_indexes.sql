-- Create indexes for performance and search functionality

-- Performance indexes
CREATE INDEX idx_legal_units_citation ON legal_units(citation);
CREATE INDEX idx_legal_units_parent ON legal_units(parent_id);
CREATE INDEX idx_legal_units_publication ON legal_units(publication_id);
CREATE INDEX idx_legal_units_status ON legal_units(status);
CREATE INDEX idx_legal_units_level ON legal_units(level);
CREATE INDEX idx_legal_units_unit_type ON legal_units(unit_type);
CREATE INDEX idx_cross_references_from ON cross_references(from_unit_id);
CREATE INDEX idx_cross_references_to ON cross_references(to_unit_id);
CREATE INDEX idx_publications_jurisdiction ON publications(jurisdiction_id);
CREATE INDEX idx_publications_active ON publications(active);
CREATE INDEX idx_jurisdiction_hierarchies_jurisdiction ON jurisdiction_hierarchies(jurisdiction_id);
CREATE INDEX idx_unit_history_unit ON unit_history(unit_id);
CREATE INDEX idx_unit_metadata_unit ON unit_metadata(unit_id);
CREATE INDEX idx_unit_metadata_type ON unit_metadata(metadata_type);

-- FTS index for full-text search
CREATE VIRTUAL TABLE legal_units_fts USING fts5(
    citation, 
    name, 
    content_text, 
    content=legal_units, 
    content_rowid=id
);

-- Triggers to keep FTS in sync with legal_units table
CREATE TRIGGER legal_units_fts_insert AFTER INSERT ON legal_units BEGIN
    INSERT INTO legal_units_fts(rowid, citation, name, content_text) 
    VALUES (new.id, new.citation, new.name, new.content_text);
END;

CREATE TRIGGER legal_units_fts_delete AFTER DELETE ON legal_units BEGIN
    INSERT INTO legal_units_fts(legal_units_fts, rowid, citation, name, content_text) 
    VALUES('delete', old.id, old.citation, old.name, old.content_text);
END;

CREATE TRIGGER legal_units_fts_update AFTER UPDATE ON legal_units BEGIN
    INSERT INTO legal_units_fts(legal_units_fts, rowid, citation, name, content_text) 
    VALUES('delete', old.id, old.citation, old.name, old.content_text);
    INSERT INTO legal_units_fts(rowid, citation, name, content_text) 
    VALUES (new.id, new.citation, new.name, new.content_text);
END;