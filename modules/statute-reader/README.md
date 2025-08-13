# Statute Reader Module

A comprehensive Nuxt module for browsing, searching, and displaying legal statutes with advanced features including hierarchical navigation, full-text search, bookmarking, and more.

## Features

- 🔍 **Advanced Search**: Full-text search with boolean operators, filtering, and autocomplete
- 📚 **Hierarchical Browsing**: Navigate statute hierarchies with expandable tree views
- 🔖 **Bookmarking System**: Save and organize frequently accessed statutes
- 📱 **Responsive Design**: Mobile-first interface using PrimeVue components
- ⚡ **High Performance**: Built on Cloudflare D1 and Vectorize for fast queries
- 🎯 **TypeScript**: Fully typed for better developer experience
- 🗃️ **Flexible Schema**: Supports multiple jurisdictions and publication types
- 🔗 **Cross-References**: Automatic linking between related statutes
- 📈 **History Tracking**: Amendment and modification history
- 🎨 **Customizable**: Themeable interface with configuration options

## Quick Start

### Installation

```bash
# Add the module to your Nuxt project
npm install @ohlaw/statute-reader

# Or use the local module during development
# (if developing within the ohlaw-www-2025 project)
```

### Configuration

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['~/modules/statute-reader'],
  
  statuteReader: {
    sources: {
      colorado: {
        baseUrl: 'https://leg.colorado.gov/agencies/office-legislative-legal-services/2024-crs-titles-download',
        enabled: true
      }
    },
    ui: {
      basePath: '/statutes',
      theme: 'primevue'
    },
    database: {
      binding: 'STATUTE_DB'
    },
    search: {
      binding: 'STATUTE_SEARCH'
    }
  }
})
```

### Environment Setup

Configure your Cloudflare bindings in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "STATUTE_DB"
database_name = "statute-reader-db"
database_id = "your-database-id"

[[vectorize]]
binding = "STATUTE_SEARCH"
index_name = "statute-search-index"
```

### Database Setup

Run the database migrations:

```bash
# Apply the schema
npx wrangler d1 execute STATUTE_DB --file=modules/statute-reader/migrations/001_initial_schema.sql
npx wrangler d1 execute STATUTE_DB --file=modules/statute-reader/migrations/002_search_indexes.sql

# Load test data (optional)
npx wrangler d1 execute STATUTE_DB --file=modules/statute-reader/migrations/003_test_data.sql
```

## Usage

### Basic Browsing

The module automatically adds pages at `/statutes` for browsing and searching:

- `/statutes` - Main interface with browser, search, and bookmarks
- `/statutes/search` - Dedicated search page
- `/statutes/{citation}` - Individual statute viewer

### Vue Components

Use the components directly in your application:

```vue
<template>
  <div>
    <!-- Statute Browser -->
    <StatuteBrowser @select="onStatuteSelect" />
    
    <!-- Search Interface -->
    <StatuteSearch @navigate="onNavigate" />
    
    <!-- Statute Viewer -->
    <StatuteViewer :citation="selectedCitation" />
  </div>
</template>
```

### Composables

Access data and functionality through composables:

```typescript
// Browsing and navigation
const { browseTree, navigateToUnit } = useStatuteBrowser()

// Search functionality
const { searchQuery, searchResults, performSearch } = useStatuteSearch()

// Data fetching
const { fetchStatute, useStatute } = useStatuteData()

// Bookmarks management
const { bookmarks, addBookmark, isBookmarked } = useStatuteBookmarks()
```

### Server API

The module provides RESTful API endpoints:

```typescript
// Search statutes
POST /api/statutes/search
{
  "query": "probate code",
  "jurisdiction_id": 1,
  "unit_types": ["section"],
  "limit": 20
}

// Browse hierarchy
GET /api/statutes/browse?parent_id=1&include_children=true

// Get specific statute
GET /api/statutes/15-10-101?include_related=true

// Admin operations
POST /api/admin/scrape
GET /api/admin/status
```

## Configuration

### Module Options

```typescript
interface StatuteReaderOptions {
  sources: {
    [key: string]: {
      baseUrl: string
      enabled: boolean
    }
  }
  ui: {
    basePath: string
    theme: string
  }
  database: {
    binding: string
  }
  search: {
    binding: string
  }
}
```

### Supported Jurisdictions

Currently supports:
- **Colorado**: Colorado Revised Statutes (C.R.S.)

Additional jurisdictions can be added by implementing scraper logic and updating the configuration.

## Database Schema

The module uses a flexible schema supporting multiple jurisdictions:

- **Jurisdictions**: Colorado, Federal, etc.
- **Publications**: Specific statute publications (e.g., 2024 C.R.S.)
- **Legal Units**: Hierarchical statute structure (Title → Article → Section)
- **Cross References**: Links between related statutes
- **History**: Amendment and modification tracking
- **Metadata**: Editorial notes and additional information

## Advanced Features

### Full-Text Search

- Boolean operators (AND, OR, NOT)
- Phrase searching with quotes
- Wildcard and fuzzy matching
- Field-specific searches (citation, name, content)
- Search suggestions and autocomplete

### Navigation

- Hierarchical tree browsing
- Breadcrumb navigation
- Sibling navigation (previous/next)
- Table of contents for complex statutes
- Quick jump to related statutes

### Bookmarking

- Personal bookmark collections
- Folder organization
- Tag-based categorization
- Export/import functionality
- Search within bookmarks

### Content Scraping

Built-in scraping capabilities for:
- Colorado Legislative website
- Automatic content parsing
- HTML cleaning and normalization
- Citation extraction and linking

## Development

### Project Structure

```
modules/statute-reader/
├── index.ts                     # Module definition
├── runtime/
│   ├── composables/            # Vue composables
│   ├── components/             # Vue components
│   ├── server/                 # Server API routes and utils
│   ├── types/                  # TypeScript definitions
│   └── pages/                  # Page components
├── migrations/                 # Database migrations
├── package.json
└── README.md
```

### Adding New Jurisdictions

1. Update the scraper logic in `runtime/server/utils/scraper.ts`
2. Add jurisdiction data to the database
3. Implement jurisdiction-specific parsing rules
4. Update the module configuration

### Custom Components

Extend or replace components by creating your own:

```vue
<template>
  <div class="custom-statute-viewer">
    <!-- Your custom implementation -->
  </div>
</template>

<script setup lang="ts">
import { useStatuteData } from '#imports'
// Your custom logic
</script>
```

## API Reference

### Composables

#### `useStatuteData()`
Core data fetching and management.

#### `useStatuteSearch()`
Search functionality and state management.

#### `useStatuteBrowser()`
Hierarchical browsing and navigation.

#### `useStatuteBookmarks()`
Bookmark management and persistence.

### Components

#### `StatuteBrowser`
Hierarchical tree browser for statutes.

#### `StatuteSearch`
Advanced search interface with filters.

#### `StatuteViewer`
Displays statute content with navigation.

#### `StatuteNavigation`
Breadcrumbs and related navigation.

### Server API

Detailed API documentation for all endpoints with request/response schemas.

## Performance

- **Database**: Optimized queries with proper indexing
- **Search**: Full-text search with FTS5 and vector search ready
- **Caching**: Built-in caching for frequently accessed data
- **Lazy Loading**: Components and data loaded on demand

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issue tracker.

For questions and discussion, contact the development team.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and changes.