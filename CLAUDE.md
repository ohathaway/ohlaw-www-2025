# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview production build locally
npx nuxthub preview

# Deploy to NuxtHub
npx nuxthub deploy

# Linting
pnpm lint
```

## Architecture Overview

This is a Nuxt 3 application with NuxtHub for a law firm website with quiz functionality and AI-powered report generation. Key architectural components:

### Core Stack
- **Framework**: Nuxt 3 with Vue 3 Composition API and NuxtHub extensions
- **Styling**: Tailwind CSS 4 + PrimeVue UI components with custom ohlaw theme preset
- **State Management**: Pinia stores with arrow function syntax
- **Package Manager**: pnpm (required)
- **Deployment**: NuxtHub (Cloudflare)
- The dev server is always running in the background when Claude Code is invoked.

### Content & Data
- **CMS**: Strapi headless CMS for blog posts and quiz data
- **API Strategy**: REST for paginated queries (Strapi 5 GraphQL pagination issues), GraphQL for single item queries, REST for mutations
- **Blog**: Dynamic routes with pre-rendered post pages via Strapi integration
- **Storage**: Cloudflare R2 for file storage (PDFs, images)

### Key Features
- **Interactive Quizzes**: Multi-step legal assessment quizzes with branching logic
- **AI Reports**: Claude AI-powered analysis of quiz results with PDF generation
- **Contact Forms**: Integration with Mailer Lite and Lawmatics CRM
- **SEO**: Automated sitemap generation from Strapi content

### Store Architecture
- `mainStore.js`: Global UI state (booking dialogs, notifications)
- `quizStore.js`: Complex quiz flow management with scoring logic, branching, and result calculation

### File Organization
- Nuxt 4 directory layout
- `app/`: Main application code following Nuxt 3 structure
- `server/`: API routes and utilities (Nitro server)
- `server/utils/`: Shared utilities organized by domain (quizzes/, reports/, mailersend/)
- `public/img/`: Static images with optimized formats (.webp preferred)

### API Patterns
- Single quiz/post queries via GraphQL for efficiency
- Blog post listings and paginated data via REST (due to Strapi 5 GraphQL pagination issues)
- Quiz submissions via REST API to Strapi
- AI analysis cached in Nuxt KV store by quiz result hash
- PDF generation using PDFKit with functional pipeline approach

### Environment Configuration
Critical environment variables for:
- Strapi CMS connection (`STRAPI_URL`)
- Cloudflare R2 storage (`CLOUDFLARE_*`)
- Claude AI API (`CLAUDE_KEY`)
- Email services (`MAILER_LITE_KEY`, `SENDGRID_KEY`)
- CRM integration (`LAWMATICS_*`)

### Component Patterns
- Vue 3 Composition API with `<script setup>`
- PrimeVue components styled with Tailwind4
- Functional utilities in `app/utils/` auto-imported
- FormKit integration currently disabled due to Tailwind 4 compatibility

### VueUse Integration
- **VueUse composables are available** - Always check VueUse before creating custom composables
- Common patterns: `useScrollTo`, `useElementVisibility`, `useLocalStorage`, `useAsyncData`
- Auto-imported via `@vueuse/nuxt` module
- Documentation: https://vueuse.org/

### Layout System
- **Auto Layout**: Uses `useAutoLayout` composable for automatic layout assignment based on route patterns
- **Layout Mapping**: Configured in `app.config.ts` with pattern matching (e.g., `/services/**` → `services` layout)
- **Manual Layout**: Pages can override auto-layout by explicitly defining layout in `<script setup>`
- **Available Layouts**: `base`, `blog`, `policy`, `services`, `default`
- **IMPORTANT**: This project uses TailwindCSS 4. Java/Typescript config files are deprecated. TailwindCSS 4 uses pure CSS.
- **IMPORTANT**: Do not manually add `<NuxtLayout>` tags to pages - the auto-layout system handles this automatically

### Code Style
- Arrow functions preferred for all function definitions
- Single quotes for strings (ESLint enforced)
- Vue components use composition API pattern
- Server utilities organized by domain with clear exports
- No semi-colons
- Use expressive syntax
- Limit use of if/then statements for readability
- Prefer functional patterns, but prioritize human readability
- Try not to exceed lines over 80 characters long
- Remember that Prime Icons text sizing classes must be applied to the parent element; ```.pi: { font-size; }``` inherit is in the site.css