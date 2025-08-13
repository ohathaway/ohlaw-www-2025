-- Test data for development and demonstration

-- Sample jurisdictions
INSERT INTO jurisdictions (name, abbreviation) VALUES 
('Colorado', 'CO'),
('Federal', 'US');

-- Sample source types
INSERT INTO source_types (name, abbreviation) VALUES 
('Revised Statutes', 'RS'),
('Code', 'CODE'),
('Constitution', 'CONST');

-- Sample publications
INSERT INTO publications (jurisdiction_id, source_type_id, name, abbreviation, year, effective_date) VALUES 
(1, 1, 'Colorado Revised Statutes 2024', 'C.R.S.', 2024, '2024-01-01'),
(2, 2, 'United States Code', 'U.S.C.', 2024, '2024-01-01');

-- Sample hierarchy configuration for Colorado
INSERT INTO jurisdiction_hierarchies (jurisdiction_id, publication_id, level, unit_type, display_name, citation_format) VALUES 
(1, 1, 1, 'title', 'Title', '§ %number%'),
(1, 1, 2, 'article', 'Article', '§ %title%-%number%'),
(1, 1, 3, 'section', 'Section', '§ %title%-%article%-%number%');

-- Sample legal units for Colorado Title 15 (Probate, Trusts, and Fiduciaries)
INSERT INTO legal_units (publication_id, parent_id, unit_type, level, number, name, citation, content_html, content_text, sort_order) VALUES 
(1, NULL, 'title', 1, '15', 'Probate, Trusts, and Fiduciaries', '§ 15', '<h1>Title 15 - Probate, Trusts, and Fiduciaries</h1><p>This title governs matters relating to probate, trusts, and fiduciary relationships.</p>', 'Title 15 - Probate, Trusts, and Fiduciaries. This title governs matters relating to probate, trusts, and fiduciary relationships.', 15);

INSERT INTO legal_units (publication_id, parent_id, unit_type, level, number, name, citation, content_html, content_text, sort_order) VALUES 
(1, 1, 'article', 2, '10', 'Colorado Probate Code', '§ 15-10', '<h2>Article 10 - Colorado Probate Code</h2><p>The Colorado Probate Code provides comprehensive rules for probate proceedings.</p>', 'Article 10 - Colorado Probate Code. The Colorado Probate Code provides comprehensive rules for probate proceedings.', 10);

INSERT INTO legal_units (publication_id, parent_id, unit_type, level, number, name, citation, content_html, content_text, sort_order) VALUES 
(1, 2, 'section', 3, '101', 'Short title', '§ 15-10-101', '<h3>§ 15-10-101. Short title</h3><p>This article shall be known and may be cited as the "Colorado Probate Code".</p>', '§ 15-10-101. Short title. This article shall be known and may be cited as the "Colorado Probate Code".', 101);

INSERT INTO legal_units (publication_id, parent_id, unit_type, level, number, name, citation, content_html, content_text, sort_order) VALUES 
(1, 2, 'section', 3, '102', 'Purposes - rule of construction', '§ 15-10-102', '<h3>§ 15-10-102. Purposes - rule of construction</h3><p>(1) This code shall be liberally construed and applied to promote its underlying purposes and policies.</p><p>(2) The underlying purposes and policies of this code are:</p><p>(a) To simplify and clarify the law concerning the affairs of decedents, missing persons, protected persons, minors, and incapacitated persons;</p>', '§ 15-10-102. Purposes - rule of construction. (1) This code shall be liberally construed and applied to promote its underlying purposes and policies. (2) The underlying purposes and policies of this code are: (a) To simplify and clarify the law concerning the affairs of decedents, missing persons, protected persons, minors, and incapacitated persons;', 102);

-- Sample cross-reference
INSERT INTO cross_references (from_unit_id, to_unit_id, reference_text, context) VALUES 
(4, 3, 'as defined in section 15-10-101', 'Reference to the short title section');

-- Sample metadata
INSERT INTO unit_metadata (unit_id, metadata_type, content_html, content_text) VALUES 
(3, 'editor_note', '<p><strong>Editor''s note:</strong> This section was amended in 2023.</p>', 'Editor''s note: This section was amended in 2023.');

-- Sample history
INSERT INTO unit_history (unit_id, source_citation, amendment_type, effective_date, description) VALUES 
(3, '2023 Session Laws Ch. 123', 'amended', '2023-07-01', 'Updated citation format');