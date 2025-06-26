# OHLaw Colorado - Legal Services Website

A comprehensive legal services website built with [Nuxt 3](https://nuxt.com) and deployed on [NuxtHub](https://hub.nuxt.com) for OHLaw Colorado.

https://www2025.ohlawcolorado.com

## Features

- **Interactive Legal Quizzes**: Multi-step assessment tools with branching logic
- **AI-Powered Reports**: Claude AI analysis of quiz results with PDF generation
- **Content Management**: Strapi CMS integration for blog posts and legal content
- **Client Forms**: Contact forms with CRM integration (Lawmatics)
- **Email Marketing**: Mailer Lite integration for newsletter management
- **SEO Optimized**: Automated sitemap generation and meta tags
- **Responsive Design**: PrimeVue UI components with custom Tailwind theme
- **Edge Deployment**: Server-side rendering on Cloudflare Workers

## Setup

Make sure to install the dependencies with [pnpm](https://pnpm.io/installation#using-corepack):

```bash
pnpm install
```

Copy the environment configuration:

```bash
cp .envrc.example .envrc
# Configure your environment variables in .envrc
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

## Deploy

Deploy the application on the Edge with [NuxtHub](https://hub.nuxt.com):

```bash
npx nuxthub deploy
```

Or deploy automatically via GitHub Actions when pushing to the `master` branch.

Monitor your deployment logs and analytics in the [NuxtHub Admin](https://admin.hub.nuxt.com).

## Architecture

- **Frontend**: Nuxt 3 with Vue 3 Composition API
- **Styling**: Tailwind CSS 4 with PrimeVue components
- **CMS**: Strapi headless CMS for content management
- **Storage**: Cloudflare R2 for file storage
- **AI**: Claude API for report generation
- **Email**: SendGrid and Mailer Lite integrations
- **CRM**: Lawmatics integration for lead management

