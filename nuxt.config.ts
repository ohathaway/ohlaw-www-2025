import tailwindcss from '@tailwindcss/vite'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import { ohLawPreset } from './primevue.ohlaw.js'

// Customization for PrimeVue
const preset = definePreset(Aura, ohLawPreset)

// console.info('ohlawPreset:', JSON.stringify(ohLawPreset, null, 2))


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@primevue/nuxt-module',
    '@formkit/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxt/image',
  ],

  formkit: {
    autoImport: true
  },

  primevue: {
    options: {
      theme: {
        preset
      },
      tailwind: true,
      unstyled: false
    },
    autoImport: true
  },

  // https://devtools.nuxt.com
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-11-01',

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    ai: true,
    kv: true
  },

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/img/ohlaw_icon.svg'
        }
      ],
      meta: [
        {
          name: "google-site-verification",
          content: "Q4l9tT_meQV5Wpva7hnU27YZyc6Eja7hVsf8NqHdhKU"
        }
      ]
    }
  },

  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    // '@formkit/themes/genesis',
    '@formkit/addons/css/floatingLabels',
    '~/assets/css/site.css',
  ],

  image: {
    cloudflare: {
      baseURL: 'https://www2025.ohlawcolorado.com'
    },
    strapi: {
      baseURL: `${process.env.STRAPI_URL}/uploads`
    },
    dir: 'public/img'
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['import']
        }
      }
    },
    plugins: [
      tailwindcss()
    ]
  },

  postcss: {
    plugins: {
      'postcss-import': {},
      'postcss-simple-vars': {},
      'postcss-nesting': {},
      'postcss-mixins': {},
      'postcss-color-function': {},
      autoprefixer: {},
      cssnano: process.env.NODE_ENV === 'production' ? {} : false
    }
  },

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

  // https://nuxtseo.com
  sitemap: {
    sources: [
      'https://strapi.ohlawcolorado.com/api/sitemap/index.xml'
    ]
  },

  // https://nuxtseo.com
  robots: {
    disallow: [
      '/contact',
      '/glossary',
      '/services',
      '/blog/categories',
      '/blog/tags',
      '/landings/booking',
      '/services/bankruptcy/about-ch7',
      '/services/estate-planning/GunTrusts'
    ],
    allow: [
      '/services/bankruptcy',
      '/services/estate-planning',
      '/services/nonprofits',
      '/services/small-business'
    ]
  },

  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})