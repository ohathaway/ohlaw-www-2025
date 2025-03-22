import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import tailwindcss from '@tailwindcss/vite'

// Customization for PrimeVue
const ohLawPreset = definePreset(Aura, {
  primitive: {
    chambray: {
      50: '#f5f7fa',
      100: '#e9edf5',
      200: '#cfd9e8',
      300: '#a4b7d5',
      400: '#7391bd',
      500: '#5173a6',
      600: '#3f5c8a',
      700: '#38507a',
      800: '#2e3f5e',
      900: '#2a3750',
      950: '#1c2435'
    }
  },
  semantic: {
    primary: {
      50: '{chambray.50}',
      100: '{chambray.100}',
      200: '{chambray.200}',
      300: '{chambray.300}',
      400: '{chambray.400}',
      500: '{chambray.500}',
      600: '{chambray.600}',
      700: '{chambray.700}',
      800: '{chambray.800}',
      900: '{chambray.900}',
      950: '{chambray.950}'
    },
  },
  components: {
    menubar: {
      background: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(0, 0, 0, 0)',
    }
  }
})

console.info('ohlawPreset:', JSON.stringify(ohLawPreset, null, 2))


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@primevue/nuxt-module'
  ],

  primevue: {
    options: {
      theme: {
        preset: ohLawPreset,
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
      helloText: 'Hello from the Edge 👋',
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-11-01',

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {},

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
    '@/assets/fonts/fonts.css',
    '@/assets/fonts/google-fonts.css',
    'primeicons/primeicons.css',
    '~/assets/css/tailwind.css',
    '~/assets/css/site.scss',
  ],

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
      tailwindcss(),
    ],
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