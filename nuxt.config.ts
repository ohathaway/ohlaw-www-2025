import tailwindcss from '@tailwindcss/vite'
// import Aura from '@primeuix/themes/aura'
// import { definePreset } from '@primeuix/themes'
// import { ohLawPreset } from './primevue.ohlaw'

// Customization for PrimeVue
// const preset = definePreset(Aura, ohLawPreset)

// Blog post prefetch helper
const getPostRoutes = async () => {
  if (!process.env.STRAPI_URL) {
    console.warn('STRAPI_URL not set, skipping post routes generation')
    return []
  }

  try {
    const pageSize = 25
    const fetchOptions = {
      headers: {
        'Strapi-Response-Format': 'v4',
      },
    }

    // Initial request to get first page and pagination info
    const initialResponse = await fetch(
      `${process.env.STRAPI_URL}/api/posts?fields[0]=slug&pagination[pageSize]=${pageSize}`,
      fetchOptions,
    )

    if (!initialResponse.ok) {
      throw new Error(`Failed to fetch posts: ${initialResponse.status} ${initialResponse.statusText}`)
    }

    const initialData = await initialResponse.json()
    const { pagination } = initialData.meta
    const { pageCount } = pagination

    // Create an array of all page numbers we need to fetch
    const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1)
      .filter(page => page > 1) // Filter out page 1 which we already have

    // Define a function to fetch a specific page
    const fetchPage = async (page: number) => {
      const response = await fetch(
        `${process.env.STRAPI_URL}/api/posts?fields[0]=slug&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
        fetchOptions,
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch page ${page}: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.data
    }

    // Initial posts from first page
    let allPosts = [...initialData.data]

    // Fetch additional pages if needed
    if (pageNumbers.length > 0) {
      const additionalPosts = await Promise.all(pageNumbers.map(fetchPage))
      allPosts = allPosts.concat(additionalPosts.flat())
    }

    console.info(`Strapi pre-render post list: found ${allPosts.length} posts`)

    // Map post slugs to routes
    return allPosts.map(post =>
      `/blog/${post?.slug ?? post?.attributes?.slug}`,
    ).filter(Boolean)
  }
  catch (error) {
    console.error('Error fetching post routes:', error)
    return []
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
/* global defineNuxtConfig */
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    // '@formkit/nuxt', // disabled as FormKit doesn't seem to work with Tailwind 4
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxthub/core',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@pinia/nuxt',
    // '@primevue/nuxt-module',
    '@vueuse/nuxt',
    'nuxt-gtag',
  ],

  // imports: {
  // dirs: ['app/utils', 'app/stores'],
  // },

  /* disabled since FormKit doesn't seem to work with Tailwind 4
  formkit: {
    autoImport: true
  },
  */

  /*
  primevue: {
    options: {
      theme: {
        preset
      },
      tailwind: true,
      unstyled: false
    },
    autoImport: false
  },
  */

  // https://devtools.nuxt.com
  devtools: {
    enabled: process.env.NODE_ENV === 'development',

    timeline: {
      enabled: process.env.NODE_ENV === 'development',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/img/ohlaw_icon.svg',
        },
      ],
      meta: [
        {
          name: 'google-site-verification',
          content: 'Q4l9tT_meQV5Wpva7hnU27YZyc6Eja7hVsf8NqHdhKU',
        },
        {
          name: 'description',
          content:
            'Expert estate planning, bankruptcy, and small business legal services in Colorado. The Law Offices of Owen Hathaway provides heart-centered legal guidance to help you protect your family and business legacy.',
        },
        {
          property: 'og:site_name',
          content: 'The Law Offices of Owen Hathaway',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:locale',
          content: 'en_US',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:site',
          content: '@ohlawcolorado',
        },
      ],
    },
  },

  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    'primeicons/primeicons.css',
    '@formkit/addons/css/floatingLabels',
    '~/assets/css/site.css',
  ],

  // SEO Configuration
  site: {
    url: 'https://ohlawcolorado.com',
    name: 'The Law Offices of Owen Hathaway',
    description:
      'Expert estate planning, bankruptcy, and small business legal services in Colorado. Heart-centered legal guidance to protect your family and business legacy.',
    defaultLocale: 'en',
  },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    cloudflare: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      apiKey: process.env.CLOUDFLARE_API_KEY,
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      bucketName: process.env.CLOUDFLARE_BUCKET_NAME,
    },
    public: {
      gitCommit: process.env.NUXT_GIT_COMMIT,
      buildDate: process.env.NUXT_BUILD_DATE,
      strapiUrl: process.env.STRAPI_URL,
      lawmatics: {
        quizFormUrl: process.env.LAWMATICS_QUIZ_FORM_URL,
      },
      searchApiKey: process.env.ME_SEARCH_KEY,
    },
    mailerLite: {
      apiKey: process.env.MAILER_LITE_KEY,
    },
    lawmatics: {
      url: process.env.LAWMATICS_URL,
      key: process.env.LAWMATICS_KEY,
    },
    claude: {
      apiKey: process.env.CLAUDE_KEY,
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_KEY,
    },
  },

  watch: ['./primevue.ohlaw.ts'],
  future: { compatibilityVersion: 4 },

  // CSS optimization
  features: {
    inlineStyles: false,
  },

  /*
  build: {
    transpile: [
      '@formkit/icons',
      '@formkit/addons',
      '@formkit/nuxt',
      '@formkit/pro',
      '@formkit/themes',
      '@formkit/vue'
    ]
  },
  */

  // Production optimizations
  experimental: {
    payloadExtraction: false,
  },
  compatibilityDate: '2024-11-01',

  nitro: {
    preset: 'cloudflare-module', // Deploy to Cloudflare Workers
    experimental: {
      openAPI: true,
    },
    routeRules: {
      '/**': {
        headers: {
          'X-Git-Commit': process.env.NUXT_GIT_COMMIT || 'unknown',
          'X-Build-Date': new Date().toISOString(),
          'X-Built-By': 'OHLaw Colorado',
        },
      },
    },
  },

  // https://hub.nuxt.com/docs/getting-started/installation#options
  // NuxtHub v0.9: boolean flags only. Resource IDs configured in wrangler.toml
  hub: {
    kv: true, // Cloudflare KV binding
    blob: true, // Cloudflare R2 blob storage
    ai: true, // Cloudflare Workers AI (optional)
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import'],
        },
      },
    },
    optimizeDeps: {
      // include: ['./primevue.ohlaw.ts', 'primeicons']
    },
    plugins: [tailwindcss()],
    build: {
      target: 'es2020',
      cssTarget: 'chrome80',
      cssCodeSplit: true,
    },
  },

  postcss: process.env.NODE_ENV === 'production'
    ? {
        plugins: {
          'postcss-import': {},
          'postcss-nesting': {},
          'autoprefixer': {},
          'cssnano': {},
        },
      }
    : {
        plugins: {
          'postcss-import': {},
          'postcss-nesting': {},
          'autoprefixer': {},
        },
      },

  hooks: {
    async 'nitro:config'(nitroConfig) {
      // fetch the routes from our function above
      const slugs = await getPostRoutes()
      console.info('slugs: ', slugs)
      // add the routes to the nitro config
      if (nitroConfig.prerender?.routes) {
        nitroConfig.prerender.routes.push(...slugs)
      }
    },
  },

  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },

  gtag: {
    id: process.env.GTAG_ID,
    enabled: process.env.NODE_ENV === 'production',
  },

  image: {
    cloudflare: {
      baseURL: 'https://www2025.ohlawcolorado.com',
    },
    strapi: {
      baseURL: `${process.env.STRAPI_URL}/uploads`,
    },
    dir: 'public/img',
  },

  // https://nuxtseo.com
  robots: {
    disallow: [
      '/color-test',
      '/glossary',
      '/blog/categories',
      '/blog/tags',
      '/landings/booking',
      '/services/bankruptcy/about-ch7',
      '/services/estate-planning/GunTrusts',
    ],
    allow: [
      '/services/bankruptcy',
      '/services/estate-planning',
      '/services/nonprofits',
      '/services/small-business',
    ],
  },

  // https://nuxtseo.com
  sitemap: {
    sources: ['https://strapi.ohlawcolorado.com/api/sitemap/index.xml'],
  },
})
