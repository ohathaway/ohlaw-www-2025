<template>
  <div class="statute-reader-main">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-3xl font-bold text-gray-900">Colorado Statute Reader</h1>
          <p class="mt-2 text-lg text-gray-600">
            Search and browse the Colorado Revised Statutes with advanced navigation and bookmarking features.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tab Navigation -->
      <TabView v-model:activeIndex="activeTab" class="statute-reader-tabs">
        <TabPanel header="Browse">
          <template #header>
            <Icon name="pi-list" class="mr-2" />
            Browse Statutes
          </template>
        </TabPanel>
        
        <TabPanel header="Search">
          <template #header>
            <Icon name="pi-search" class="mr-2" />
            Search
          </template>
        </TabPanel>
        
        <TabPanel header="Bookmarks">
          <template #header>
            <Icon name="pi-bookmark" class="mr-2" />
            Bookmarks
            <Badge v-if="bookmarkCount > 0" :value="bookmarkCount" severity="info" class="ml-2" />
          </template>
        </TabPanel>
      </TabView>

      <!-- Tab Content -->
      <div class="mt-6">
        <!-- Browse Tab -->
        <div v-if="activeTab === 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Browser Panel -->
          <div class="lg:col-span-1">
            <Card class="h-full">
              <template #title>
                <div class="flex items-center justify-between">
                  <span>Statute Browser</span>
                  <Button
                    @click="refreshBrowser"
                    size="small"
                    text
                    severity="secondary"
                    title="Refresh"
                  >
                    <Icon name="pi-refresh" />
                  </Button>
                </div>
              </template>
              <template #content>
                <StatuteBrowser
                  @select="onStatuteSelect"
                  @navigate="onStatuteNavigate"
                  :max-height="'600px'"
                />
              </template>
            </Card>
          </div>

          <!-- Viewer Panel -->
          <div class="lg:col-span-2">
            <Card class="h-full">
              <template #title>
                <span>Statute Viewer</span>
              </template>
              <template #content>
                <StatuteViewer
                  :citation="selectedCitation"
                  @navigate="onStatuteNavigate"
                />
              </template>
            </Card>
          </div>
        </div>

        <!-- Search Tab -->
        <div v-else-if="activeTab === 1">
          <Card>
            <template #content>
              <StatuteSearch
                :initial-query="searchQuery"
                @select="onSearchResultSelect"
                @navigate="onStatuteNavigate"
              />
            </template>
          </Card>
        </div>

        <!-- Bookmarks Tab -->
        <div v-else-if="activeTab === 2">
          <StatuteBookmarksPanel
            @navigate="onStatuteNavigate"
          />
        </div>
      </div>
    </div>

    <!-- Quick Actions Sidebar -->
    <div class="fixed bottom-6 right-6 z-50">
      <div class="flex flex-col gap-2">
        <!-- Quick Search -->
        <Button
          @click="showQuickSearch = true"
          severity="info"
          rounded
          size="large"
          title="Quick Search (Ctrl+K)"
        >
          <Icon name="pi-search" />
        </Button>
        
        <!-- Bookmark Current -->
        <Button
          v-if="selectedCitation"
          @click="bookmarkCurrent"
          severity="warning"
          rounded
          size="large"
          title="Bookmark Current Statute"
        >
          <Icon name="pi-bookmark" />
        </Button>
        
        <!-- Help -->
        <Button
          @click="showHelp = true"
          severity="help"
          rounded
          size="large"
          title="Help"
        >
          <Icon name="pi-question" />
        </Button>
      </div>
    </div>

    <!-- Quick Search Dialog -->
    <Dialog
      v-model:visible="showQuickSearch"
      modal
      :style="{ width: '50rem' }"
      header="Quick Search"
    >
      <div class="p-4">
        <InputText
          v-model="quickSearchQuery"
          placeholder="Enter citation or search term..."
          class="w-full text-lg p-3"
          @keyup.enter="performQuickSearch"
          autofocus
        />
        
        <div v-if="quickSearchResults.length > 0" class="mt-4 max-h-64 overflow-auto">
          <div
            v-for="result in quickSearchResults"
            :key="result.unit.id"
            class="p-2 hover:bg-gray-50 cursor-pointer rounded"
            @click="selectQuickSearchResult(result)"
          >
            <div class="font-medium text-blue-600">{{ result.unit.citation }}</div>
            <div v-if="result.unit.name" class="text-sm text-gray-600">{{ result.unit.name }}</div>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Help Dialog -->
    <Dialog
      v-model:visible="showHelp"
      modal
      :style="{ width: '40rem' }"
      header="Statute Reader Help"
    >
      <div class="p-4 space-y-4">
        <div>
          <h3 class="font-semibold mb-2">Search Tips</h3>
          <ul class="text-sm space-y-1 text-gray-600">
            <li>• Use exact citations like "15-10-101" for precise results</li>
            <li>• Search by keywords like "probate" or "trust"</li>
            <li>• Use quotes for exact phrases: "fiduciary duty"</li>
            <li>• Combine terms with AND, OR, NOT</li>
          </ul>
        </div>
        
        <div>
          <h3 class="font-semibold mb-2">Navigation</h3>
          <ul class="text-sm space-y-1 text-gray-600">
            <li>• Click on statutes in the browser to view content</li>
            <li>• Use breadcrumbs to navigate up the hierarchy</li>
            <li>• Arrow buttons navigate between siblings</li>
          </ul>
        </div>
        
        <div>
          <h3 class="font-semibold mb-2">Keyboard Shortcuts</h3>
          <ul class="text-sm space-y-1 text-gray-600">
            <li>• <kbd class="bg-gray-200 px-1 rounded">Ctrl+K</kbd> - Quick search</li>
            <li>• <kbd class="bg-gray-200 px-1 rounded">Ctrl+B</kbd> - Toggle bookmarks</li>
            <li>• <kbd class="bg-gray-200 px-1 rounded">Escape</kbd> - Close dialogs</li>
          </ul>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { LegalUnit, SearchResult } from '../../types'

// Meta and SEO
definePageMeta({
  title: 'Colorado Statute Reader',
  description: 'Search and browse the Colorado Revised Statutes with advanced features'
})

useSeoMeta({
  title: 'Colorado Statute Reader - Browse & Search CRS',
  ogTitle: 'Colorado Statute Reader',
  description: 'Browse and search the Colorado Revised Statutes with advanced navigation, search, and bookmarking features.',
  ogDescription: 'Browse and search the Colorado Revised Statutes with advanced navigation, search, and bookmarking features.',
  ogImage: '/images/statute-reader-og.jpg',
  twitterCard: 'summary_large_image'
})

// Reactive state
const activeTab = ref(0)
const selectedCitation = ref<string>('')
const searchQuery = ref('')
const showQuickSearch = ref(false)
const showHelp = ref(false)
const quickSearchQuery = ref('')
const quickSearchResults = ref<SearchResult[]>([])

// URL query params
const route = useRoute()
const router = useRouter()

// Composables
const { bookmarkCount } = useStatuteBookmarks()
const { performSearch } = useStatuteSearch()

// Watch for URL changes to set active tab and citation
watch(() => route.query, (newQuery) => {
  if (newQuery.tab) {
    activeTab.value = parseInt(newQuery.tab as string) || 0
  }
  if (newQuery.search) {
    searchQuery.value = newQuery.search as string
    activeTab.value = 1 // Switch to search tab
  }
  if (newQuery.citation) {
    selectedCitation.value = newQuery.citation as string
  }
}, { immediate: true })

// Watch activeTab to update URL
watch(activeTab, (newTab) => {
  router.replace({
    query: { ...route.query, tab: newTab.toString() }
  })
})

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'k':
        case 'K':
          event.preventDefault()
          showQuickSearch.value = true
          break
        case 'b':
        case 'B':
          event.preventDefault()
          activeTab.value = 2 // Bookmarks tab
          break
      }
    }
    
    if (event.key === 'Escape') {
      showQuickSearch.value = false
      showHelp.value = false
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})

// Event handlers
const onStatuteSelect = (unit: LegalUnit) => {
  selectedCitation.value = unit.citation
  
  // Update URL to include citation
  router.replace({
    query: { ...route.query, citation: unit.citation }
  })
}

const onStatuteNavigate = (unit: LegalUnit) => {
  // Navigate to the detailed statute page
  router.push(`/statutes/${encodeURIComponent(unit.citation)}`)
}

const onSearchResultSelect = (result: SearchResult) => {
  onStatuteSelect(result.unit)
}

const refreshBrowser = () => {
  // Trigger browser refresh
  window.location.reload()
}

const performQuickSearch = async () => {
  if (!quickSearchQuery.value.trim()) return
  
  try {
    const response = await performSearch(quickSearchQuery.value, { limit: 10 })
    quickSearchResults.value = response?.results || []
  } catch (error) {
    console.error('Quick search failed:', error)
    quickSearchResults.value = []
  }
}

const selectQuickSearchResult = (result: SearchResult) => {
  showQuickSearch.value = false
  quickSearchQuery.value = ''
  quickSearchResults.value = []
  onStatuteNavigate(result.unit)
}

const bookmarkCurrent = () => {
  if (selectedCitation.value) {
    // This would bookmark the current statute
    const { addBookmark } = useStatuteBookmarks()
    // Would need to get the full unit data first
    console.log('Bookmark current statute:', selectedCitation.value)
  }
}

// Watch quick search query for auto-search
watch(quickSearchQuery, useDebounceFn((query: string) => {
  if (query.length >= 2) {
    performQuickSearch()
  } else {
    quickSearchResults.value = []
  }
}, 300))
</script>

<style scoped>
.statute-reader-main {
  @apply min-h-screen bg-gray-50;
}

:deep(.statute-reader-tabs .p-tabview-nav) {
  @apply bg-white border-b border-gray-200;
}

:deep(.statute-reader-tabs .p-tabview-header) {
  @apply text-sm font-medium;
}

kbd {
  @apply font-mono text-xs;
}
</style>