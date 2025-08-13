<template>
  <div class="statute-search-page">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Search Statutes</h1>
              <p class="mt-2 text-lg text-gray-600">
                Search through the Colorado Revised Statutes
              </p>
            </div>
            
            <!-- Quick Actions -->
            <div class="flex items-center gap-2">
              <Button
                @click="goToBrowser"
                severity="secondary"
                outlined
              >
                <Icon name="pi-list" class="mr-2" />
                Browse Statutes
              </Button>
              
              <Button
                @click="goToBookmarks"
                severity="info"
                outlined
              >
                <Icon name="pi-bookmark" class="mr-2" />
                Bookmarks
                <Badge v-if="bookmarkCount > 0" :value="bookmarkCount" severity="info" class="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Search Panel -->
        <div class="lg:col-span-3">
          <Card class="h-full">
            <template #content>
              <StatuteSearch
                :initial-query="initialSearchQuery"
                :auto-focus="true"
                @select="onSearchResultSelect"
                @navigate="onStatuteNavigate"
              />
            </template>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Search Tips -->
          <Card>
            <template #title>
              <div class="flex items-center">
                <Icon name="pi-info-circle" class="mr-2 text-blue-500" />
                Search Tips
              </div>
            </template>
            <template #content>
              <div class="space-y-3 text-sm">
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Citation Search</h4>
                  <p class="text-gray-600">Use exact citations like "15-10-101" for precise results</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Keyword Search</h4>
                  <p class="text-gray-600">Search by topic: "probate", "trust", "fiduciary duty"</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Exact Phrases</h4>
                  <p class="text-gray-600">Use quotes for exact matches: "power of attorney"</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Boolean Search</h4>
                  <p class="text-gray-600">Combine terms with AND, OR, NOT operators</p>
                </div>
              </div>
            </template>
          </Card>

          <!-- Popular Searches -->
          <Card>
            <template #title>
              <div class="flex items-center">
                <Icon name="pi-star" class="mr-2 text-yellow-500" />
                Popular Searches
              </div>
            </template>
            <template #content>
              <div class="space-y-2">
                <Button
                  v-for="search in popularSearches"
                  :key="search.query"
                  @click="performPopularSearch(search.query)"
                  text
                  size="small"
                  severity="secondary"
                  class="w-full justify-start"
                >
                  <div class="text-left">
                    <div class="font-medium">{{ search.query }}</div>
                    <div class="text-xs text-gray-500">{{ search.description }}</div>
                  </div>
                </Button>
              </div>
            </template>
          </Card>

          <!-- Recent Searches -->
          <Card v-if="recentSearches.length > 0">
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="pi-clock" class="mr-2 text-gray-500" />
                  Recent Searches
                </div>
                <Button
                  @click="clearRecentSearches"
                  size="small"
                  text
                  severity="secondary"
                  title="Clear all"
                >
                  <Icon name="pi-times" />
                </Button>
              </div>
            </template>
            <template #content>
              <div class="space-y-1">
                <Button
                  v-for="search in recentSearches.slice(0, 5)"
                  :key="search"
                  @click="performRecentSearch(search)"
                  text
                  size="small"
                  severity="secondary"
                  class="w-full justify-start text-left"
                >
                  {{ search }}
                </Button>
              </div>
            </template>
          </Card>

          <!-- Advanced Filters Guide -->
          <Card>
            <template #title>
              <div class="flex items-center">
                <Icon name="pi-filter" class="mr-2 text-purple-500" />
                Filter Options
              </div>
            </template>
            <template #content>
              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">By Jurisdiction</span>
                  <Badge value="CO" severity="info" size="small" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">By Unit Type</span>
                  <span class="text-xs text-gray-500">Title, Article, Section</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Include Repealed</span>
                  <span class="text-xs text-gray-500">Historical statutes</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Exact Match</span>
                  <span class="text-xs text-gray-500">Precise citations</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- Featured Statute Sections -->
    <div class="bg-gray-50 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Featured Statute Sections</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="section in featuredSections"
            :key="section.citation"
            class="cursor-pointer hover:shadow-md transition-shadow"
            @click="navigateToSection(section)"
          >
            <template #title>
              <div class="flex items-center">
                <Icon :name="section.icon" :class="section.iconColor" class="mr-3" />
                {{ section.title }}
              </div>
            </template>
            <template #content>
              <p class="text-gray-600 mb-3">{{ section.description }}</p>
              <div class="text-sm text-blue-600 font-medium">{{ section.citation }}</div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchResult, LegalUnit } from '../../types'

// Meta and SEO
definePageMeta({
  title: 'Search Colorado Statutes',
  description: 'Search through the Colorado Revised Statutes with advanced search capabilities'
})

useSeoMeta({
  title: 'Search Colorado Statutes - Advanced Statute Search',
  ogTitle: 'Search Colorado Statutes',
  description: 'Search through the Colorado Revised Statutes with advanced filtering, boolean operators, and smart suggestions.',
  ogDescription: 'Search through the Colorado Revised Statutes with advanced filtering, boolean operators, and smart suggestions.',
  ogImage: '/images/statute-search-og.jpg',
  twitterCard: 'summary_large_image'
})

// Get route and router
const route = useRoute()
const router = useRouter()

// Get initial search query from URL
const initialSearchQuery = computed(() => route.query.q as string || '')

// Composables
const { bookmarkCount } = useStatuteBookmarks()
const { searchHistory, clearHistory } = useStatuteSearch()

// Static data
const popularSearches = [
  {
    query: 'probate code',
    description: 'Colorado Probate Code procedures and requirements'
  },
  {
    query: 'trust administration',
    description: 'Trust management and fiduciary duties'
  },
  {
    query: 'guardianship',
    description: 'Guardianship laws and procedures'
  },
  {
    query: 'power of attorney',
    description: 'Powers of attorney and agent duties'
  },
  {
    query: 'fiduciary duty',
    description: 'Fiduciary responsibilities and standards'
  },
  {
    query: '15-10-101',
    description: 'Colorado Probate Code - Short title'
  }
]

const featuredSections = [
  {
    title: 'Colorado Probate Code',
    description: 'Comprehensive probate procedures, estate administration, and court processes.',
    citation: 'Title 15, Article 10',
    icon: 'pi-book',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Trust Code',
    description: 'Trust creation, administration, modification, and termination rules.',
    citation: 'Title 15, Article 11',
    icon: 'pi-shield',
    iconColor: 'text-green-600'
  },
  {
    title: 'Guardianship & Conservatorship',
    description: 'Protection of minors and incapacitated persons through legal guardianship.',
    citation: 'Title 15, Article 14',
    icon: 'pi-users',
    iconColor: 'text-purple-600'
  },
  {
    title: 'Powers of Attorney',
    description: 'Agent authority, duties, and limitations in power of attorney arrangements.',
    citation: 'Title 15, Article 15',
    icon: 'pi-file-edit',
    iconColor: 'text-orange-600'
  },
  {
    title: 'Estate Planning',
    description: 'Wills, advance directives, and estate planning documentation.',
    citation: 'Title 15, Article 11',
    icon: 'pi-calendar',
    iconColor: 'text-red-600'
  },
  {
    title: 'Fiduciary Standards',
    description: 'Standards of conduct and liability for fiduciaries in various roles.',
    citation: 'Title 15, Article 1',
    icon: 'pi-star',
    iconColor: 'text-yellow-600'
  }
]

// Computed
const recentSearches = computed(() => searchHistory.value || [])

// Event handlers
const onSearchResultSelect = (result: SearchResult) => {
  // Navigate to the detailed view
  onStatuteNavigate(result.unit)
}

const onStatuteNavigate = (unit: LegalUnit) => {
  router.push(`/statutes/${encodeURIComponent(unit.citation)}`)
}

const performPopularSearch = (query: string) => {
  router.push({
    path: '/statutes/search',
    query: { q: query }
  })
}

const performRecentSearch = (query: string) => {
  router.push({
    path: '/statutes/search',
    query: { q: query }
  })
}

const clearRecentSearches = () => {
  clearHistory()
}

const navigateToSection = (section: any) => {
  // Navigate to the section - this would need the actual citation
  router.push(`/statutes/${encodeURIComponent(section.citation)}`)
}

const goToBrowser = () => {
  router.push('/statutes?tab=0')
}

const goToBookmarks = () => {
  router.push('/statutes?tab=2')
}

// Update page title based on search query
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    useSeoMeta({
      title: `Search Results for "${newQuery}" - Colorado Statutes`
    })
  }
}, { immediate: true })
</script>

<style scoped>
.statute-search-page {
  @apply min-h-screen bg-gray-50;
}
</style>