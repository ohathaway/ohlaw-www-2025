# Multi-Jurisdiction Statute Scraper Architecture

This directory contains the Crawlee-based multi-jurisdiction statute scraper implementation. The architecture is designed for extensibility, allowing easy addition of new jurisdictions while maintaining a consistent interface.

## Architecture Overview

```
utils/
├── crawlers/
│   ├── base.ts           # Abstract base crawler with common functionality
│   ├── colorado.ts       # Colorado-specific crawler implementation  
│   ├── texas.ts          # Texas-specific crawler (example)
│   └── README.md         # This file
├── parsers/
│   ├── common.ts         # Shared parsing utilities
│   ├── colorado.ts       # Colorado HTML parsing logic
│   └── texas.ts          # Texas HTML parsing logic (example)
├── database.ts           # D1 database operations
└── scraper.ts           # Main orchestration + multi-jurisdiction routing
```

## Key Components

### Base Crawler (`base.ts`)
- **Abstract class** that all jurisdiction-specific crawlers extend
- **Crawlee integration** for robust web scraping infrastructure
- **Common functionality**: URL discovery, database operations, error handling
- **Statistics tracking**: URLs processed, statutes parsed, errors encountered
- **Dry run support** for testing without database modifications

### Jurisdiction-Specific Crawlers
Each jurisdiction has its own crawler that extends `BaseCrawler`:

#### Colorado Crawler (`colorado.ts`)
- **URL Discovery**: Finds Title-XX.html files from Colorado's download page
- **Crawlee Configuration**: Optimized for Colorado's website structure
- **Parsing Integration**: Uses ColoradoParser for statute extraction
- **Production Ready**: Handles Colorado's current statute format

#### Texas Crawler (`texas.ts`) 
- **Example Implementation**: Demonstrates extensibility pattern
- **Different Structure**: Handles Texas's "Code" organization vs Colorado's "Title" structure
- **Placeholder Logic**: Framework ready for Texas-specific implementation
- **Template**: Shows how to add new jurisdictions

### Parsers
Jurisdiction-specific HTML parsing logic:

#### Common Parser (`parsers/common.ts`)
- **Shared utilities** for text cleaning, citation extraction, metadata parsing
- **Hierarchical numbering** support (handles decimals like 1.1, 1.2)
- **Content extraction** while preserving important formatting
- **Citation validation** and generation

#### Colorado Parser (`parsers/colorado.ts`)
- **Colorado-specific** statute structure parsing
- **Hierarchical extraction**: Title → Article → Part → Section
- **Citation patterns**: Recognizes "XX-X-XXX." format
- **Metadata extraction**: Source, cross-references, editor's notes

## Multi-Jurisdiction Extensibility

### Adding a New Jurisdiction

1. **Create Crawler** (`crawlers/newstate.ts`):
   ```typescript
   export class NewStateCrawler extends BaseCrawler {
     async discoverUrls(): Promise<string[]> {
       // State-specific URL discovery
     }
     
     createCrawler(): CheerioCrawler {
       // State-specific Crawlee configuration
     }
     
     async parseStatutes(html: string, url: string): Promise<ParsedStatute[]> {
       // Use state-specific parser
     }
   }
   ```

2. **Create Parser** (`parsers/newstate.ts`):
   ```typescript
   export class NewStateParser extends CommonParser {
     static parseStatutes($: CheerioAPI, url: string): ParsedStatute[] {
       // State-specific HTML parsing logic
     }
   }
   ```

3. **Register in Main Scraper** (`scraper.ts`):
   ```typescript
   case 'newstate':
   case 'ns':
     return this.runCrawler(createNewStateCrawler(this.db, crawlerConfig))
   ```

### Jurisdiction Examples

#### Colorado
- **Structure**: Numbered titles (1-50+)
- **URL Pattern**: `Title-XX.html`
- **Citation Format**: `15-10-101` (Title-Article-Section)
- **Challenges**: No semantic HTML, bold pattern detection

#### Texas (Template)
- **Structure**: Subject-matter codes (Business & Commerce, Family, etc.)
- **URL Pattern**: `BC.htm`, `FA.htm` (code abbreviations)
- **Citation Format**: `BC-1-101` (Code-Title-Section)
- **Challenges**: Different organizational structure

#### Future Jurisdictions
- **California**: Complex multi-volume structure
- **Federal**: USC organized by titles and sections
- **New York**: Consolidated laws by subject matter

## Crawlee Advantages

- **Production-Ready**: Built-in retry logic, request queueing, error handling
- **Anti-Bot Features**: Automatic header rotation, session management
- **Flexible**: Can switch between Cheerio (fast) and Puppeteer (JS-heavy sites)
- **Robust**: Used by Apify for production web scraping at scale
- **Observable**: Built-in logging and progress tracking

## Usage Examples

### Colorado Statutes
```bash
curl -X POST http://localhost:3000/api/statutes/admin/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "jurisdiction": "CO",
    "source_url": "https://leg.colorado.gov/agencies/office-legislative-legal-services/2024-crs-titles-download",
    "dry_run": true
  }'
```

### Texas Statutes (When Implemented)
```bash
curl -X POST http://localhost:3000/api/statutes/admin/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "jurisdiction": "TX", 
    "source_url": "https://statutes.capitol.texas.gov/",
    "dry_run": true
  }'
```

## Development Workflow

1. **Test Single Jurisdiction**: Start with dry runs on one jurisdiction
2. **Implement Parser**: Focus on jurisdiction-specific HTML patterns
3. **Configure Crawler**: Optimize Crawlee settings for target website
4. **Database Integration**: Ensure proper hierarchical relationships
5. **Error Handling**: Test with malformed or missing content
6. **Production Deployment**: Remove dry run, monitor statistics

## Benefits

- **Consistent Interface**: All jurisdictions use the same API
- **Shared Infrastructure**: Crawlee handles the complex scraping logic
- **Easy Extension**: Adding new jurisdictions requires minimal boilerplate
- **Robust Error Handling**: Built-in retry and failure management
- **Scalable**: Can handle multiple jurisdictions concurrently
- **Maintainable**: Clear separation between parsing logic and scraping infrastructure