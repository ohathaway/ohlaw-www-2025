-- Initial schema for statute reader module
-- Supports flexible hierarchy for different legal code structures

-- jurisdictions table
CREATE TABLE jurisdictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- source_types table  
CREATE TABLE source_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- publications table
CREATE TABLE publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jurisdiction_id INTEGER NOT NULL,
    source_type_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    abbreviation TEXT,
    year INTEGER,
    effective_date DATE,
    superseded_date DATE,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(id),
    FOREIGN KEY (source_type_id) REFERENCES source_types(id)
);

-- jurisdiction_hierarchies table (configuration)
CREATE TABLE jurisdiction_hierarchies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jurisdiction_id INTEGER NOT NULL,
    publication_id INTEGER,
    level INTEGER NOT NULL,
    unit_type TEXT NOT NULL,
    display_name TEXT NOT NULL,
    citation_format TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(id),
    FOREIGN KEY (publication_id) REFERENCES publications(id)
);

-- legal_units table (generic hierarchy)
CREATE TABLE legal_units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publication_id INTEGER NOT NULL,
    parent_id INTEGER,
    unit_type TEXT NOT NULL,
    level INTEGER NOT NULL,
    number TEXT,
    name TEXT,
    citation TEXT NOT NULL,
    content_html TEXT,
    content_text TEXT,
    status TEXT DEFAULT 'active',
    effective_date DATE,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publication_id) REFERENCES publications(id),
    FOREIGN KEY (parent_id) REFERENCES legal_units(id)
);

-- cross_references table
CREATE TABLE cross_references (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_unit_id INTEGER NOT NULL,
    to_unit_id INTEGER NOT NULL,
    reference_text TEXT,
    context TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_unit_id) REFERENCES legal_units(id),
    FOREIGN KEY (to_unit_id) REFERENCES legal_units(id)
);

-- unit_history table
CREATE TABLE unit_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_id INTEGER NOT NULL,
    source_citation TEXT,
    amendment_type TEXT,
    effective_date DATE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES legal_units(id)
);

-- unit_metadata table
CREATE TABLE unit_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_id INTEGER NOT NULL,
    metadata_type TEXT NOT NULL,
    content_html TEXT,
    content_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES legal_units(id)
);