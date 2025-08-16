import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addServerHandler,
  addComponent,
  addImports
} from '@nuxt/kit'
import { defu } from 'defu'

export interface StatuteReaderOptions {
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
}

export default defineNuxtModule<StatuteReaderOptions>({
  meta: {
    name: 'statute-reader',
    configKey: 'statuteReader',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0'
    }
  },
  defaults: {
    sources: {
      colorado: {
        baseUrl: 'https://leg.colorado.gov/agencies/office-legislative-legal-services/2024-crs-titles-download',
        enabled: true
      }
    },
    ui: {
      basePath: '/statutes',
      theme: 'primevue'
    }
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add CSS
    nuxt.options.css = nuxt.options.css || []
    nuxt.options.css.push(resolver.resolve('./runtime/assets/statute-reader.css'))

    // Merge options with defaults
    nuxt.options.runtimeConfig.statuteReader = defu(
      nuxt.options.runtimeConfig.statuteReader,
      options
    )

    // Add server API routes
    addServerHandler({
      route: '/api/statutes/search',
      handler: resolver.resolve('./runtime/server/api/statutes/search.post')
    })

    addServerHandler({
      route: '/api/statutes/browse',
      handler: resolver.resolve('./runtime/server/api/statutes/browse.get')
    })

    addServerHandler({
      route: '/api/statutes/jurisdictions',
      handler: resolver.resolve('./runtime/server/api/statutes/jurisdictions.get')
    })

    addServerHandler({
      route: '/api/statutes/publications',
      handler: resolver.resolve('./runtime/server/api/statutes/publications.get')
    })

    addServerHandler({
      route: '/api/statutes/autocomplete',
      handler: resolver.resolve('./runtime/server/api/statutes/autocomplete.get')
    })

    addServerHandler({
      route: '/api/statutes/*',
      handler: resolver.resolve('./runtime/server/api/statutes/[citation].get')
    })

    addServerHandler({
      route: '/api/statutes/admin/scrape',
      handler: resolver.resolve('./runtime/server/api/statutes/admin/scrape.post')
    })

    addServerHandler({
      route: '/api/statutes/admin/status',
      handler: resolver.resolve('./runtime/server/api/statutes/admin/status.get')
    })

    // Register components
    addComponent({
      name: 'StatuteBrowser',
      filePath: resolver.resolve('./runtime/components/StatuteBrowser.vue')
    })

    addComponent({
      name: 'StatuteSearch',
      filePath: resolver.resolve('./runtime/components/StatuteSearch.vue')
    })

    addComponent({
      name: 'StatuteViewer',
      filePath: resolver.resolve('./runtime/components/StatuteViewer.vue')
    })

    addComponent({
      name: 'StatuteNavigation',
      filePath: resolver.resolve('./runtime/components/StatuteNavigation.vue')
    })

    addComponent({
      name: 'StatuteBrowserNode',
      filePath: resolver.resolve('./runtime/components/StatuteBrowserNode.vue')
    })

    addComponent({
      name: 'StatuteSearchResult',
      filePath: resolver.resolve('./runtime/components/StatuteSearchResult.vue')
    })

    addComponent({
      name: 'Collapsible',
      filePath: resolver.resolve('./runtime/components/Collapsible.vue')
    })

    addComponent({
      name: 'Icon',
      filePath: resolver.resolve('./runtime/components/Icon.vue')
    })

    addComponent({
      name: 'StatuteBookmarksPanel',
      filePath: resolver.resolve('./runtime/components/StatuteBookmarksPanel.vue')
    })

    // Add composables
    addImports([
      {
        name: 'useStatuteSearch',
        as: 'useStatuteSearch',
        from: resolver.resolve('./runtime/composables/useStatuteSearch')
      },
      {
        name: 'useStatuteBrowser',
        as: 'useStatuteBrowser',
        from: resolver.resolve('./runtime/composables/useStatuteBrowser')
      },
      {
        name: 'useStatuteData',
        as: 'useStatuteData',
        from: resolver.resolve('./runtime/composables/useStatuteData')
      },
      {
        name: 'useStatuteBookmarks',
        as: 'useStatuteBookmarks',
        from: resolver.resolve('./runtime/composables/useStatuteBookmarks')
      }
    ])

    // Add pages
    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'statutes',
        path: options.ui.basePath,
        file: resolver.resolve('./runtime/pages/statutes/index.vue')
      })

      pages.push({
        name: 'statutes-search',
        path: `${options.ui.basePath}/search`,
        file: resolver.resolve('./runtime/pages/statutes/search.vue')
      })

      pages.push({
        name: 'statutes-citation',
        path: `${options.ui.basePath}/**`,
        file: resolver.resolve('./runtime/pages/statutes/[...citation].vue')
      })
    })
  }
})