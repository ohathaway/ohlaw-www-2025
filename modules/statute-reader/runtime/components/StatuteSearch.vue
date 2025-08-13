<template>
  <div class="statute-search">
    <!-- Search Header -->
    <div class="search-header bg-white border-b border-gray-200 p-4">
      <!-- Main Search Input -->
      <div class="relative mb-4">
        <InputText
          v-model="searchQuery"
          placeholder="Search statutes (e.g., '15-10-101' or 'probate code')..."
          class="w-full pl-10 pr-4 py-3 text-lg"
          @keyup.enter="performSearch(searchQuery)"
        />
        
        <Icon
          name="pi-search"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        
        <Button
          v-if="searchQuery"
          @click="clearSearch"
          size="small"
          text
          class="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Icon name="pi-times" class="text-gray-400" />
        </Button>
      </div>

      <!-- Advanced Filters -->
      <Collapsible>
        <template #trigger="{ expanded, toggle }">
          <Button
            @click="toggle"
            text
            size="small"
            class="mb-2"
          >
            <Icon :name="expanded ? 'pi-chevron-down' : 'pi-chevron-right'" class="mr-1" />
            Advanced Filters
          </Button>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded">
          <Select
            v-model="filters.jurisdictionId"
            :options="jurisdictions"
            option-label="name"
            option-value="id"
            placeholder="Jurisdiction"
            class="w-full"
          />
          
          <Select
            v-model="filters.publicationId"
            :options="filteredPublications"
            option-label="name"
            option-value="id"
            placeholder="Publication"
            class="w-full"
            :disabled="!filters.jurisdictionId"
          />
          
          <MultiSelect
            v-model="filters.unitTypes"
            :options="unitTypeOptions"
            option-label="label"
            option-value="value"
            placeholder="Unit Types"
            class="w-full"
          />
          
          <div class="flex items-center gap-4">
            <Checkbox
              v-model="filters.exactMatch"
              binary
              input-id="exact-match"
            />
            <label for="exact-match" class="text-sm">Exact match</label>
            
            <Checkbox
              v-model="filters.includeRepealed"
              binary
              input-id="include-repealed"
            />
            <label for="include-repealed" class="text-sm">Include repealed</label>
          </div>
        </div>
      </Collapsible>

      <!-- Search Stats -->
      <div v-if="totalResults > 0" class="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          {{ totalResults.toLocaleString() }} results found
          <span v-if="searchTime > 0">({{ searchTime }}ms)</span>
        </span>
        
        <div class="flex items-center gap-2">
          <label for="results-per-page" class="text-xs">Results per page:</label>
          <Select
            v-model="resultsPerPage"
            :options="[10, 20, 50, 100]"
            class="w-20"
            size="small"
          />
        </div>
      </div>

      <!-- Search History -->
      <div v-if="searchHistory.length > 0" class="mt-4">
        <p class="text-sm text-gray-600 mb-2">Recent searches:</p>
        <div class="flex flex-wrap gap-2">
          <Chip
            v-for="query in searchHistory.slice(0, 5)"
            :key="query"
            :label="query"
            class="cursor-pointer"
            @click="searchFromHistory(query)"
            removable
            @remove="removeFromHistory(query)"
          />
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div class="search-results flex-1 overflow-auto">
      <!-- Loading State -->
      <div v-if="isSearching" class="flex items-center justify-center p-8">
        <ProgressSpinner size="2rem" />
        <span class="ml-2 text-gray-600">Searching...</span>
      </div>

      <!-- Error State -->
      <Message
        v-else-if="searchError"
        severity="error"
        :closable="false"
        class="m-4"
      >
        {{ searchError }}
      </Message>

      <!-- No Results -->
      <div
        v-else-if="searchQuery && searchResults.length === 0 && !isSearching"
        class="text-center p-8"
      >
        <Icon name="pi-search" class="text-4xl text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No results found</h3>
        <p class="text-gray-600 mb-4">
          No statutes match your search for "{{ searchQuery }}"
        </p>
        
        <!-- Suggestions -->
        <div v-if="suggestions.length > 0" class="mt-4">
          <p class="text-sm text-gray-600 mb-2">Did you mean:</p>
          <div class="flex flex-wrap justify-center gap-2">
            <Button
              v-for="suggestion in suggestions"
              :key="suggestion"
              :label="suggestion"
              text
              size="small"
              @click="setSearchQuery(suggestion)"
            />
          </div>
        </div>
      </div>

      <!-- Search Results List -->
      <div v-else-if="searchResults.length > 0" class="p-4">
        <StatuteSearchResult
          v-for="result in searchResults"
          :key="result.unit.id"
          :result="result"
          :search-query="searchQuery"
          @select="onResultSelect"
          @bookmark="onBookmark"
          class="mb-4"
        />

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <Paginator
            :rows="resultsPerPage"
            :total-records="totalResults"
            :first="(currentPage - 1) * resultsPerPage"
            @page="onPageChange"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!searchQuery"
        class="flex flex-col items-center justify-center p-8 text-gray-500"
      >
        <Icon name="pi-search" class="text-4xl mb-4" />
        <h3 class="text-lg font-medium mb-2">Search Colorado Statutes</h3>
        <p class="text-center max-w-md">
          Enter a citation, keyword, or phrase to search through the Colorado Revised Statutes.
          Use quotes for exact phrases or specific citation formats.
        </p>
        
        <!-- Quick Search Examples -->
        <div class="mt-6">
          <p class="text-sm font-medium mb-2">Try these examples:</p>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="example in searchExamples"
              :key="example"
              :label="example"
              text
              size="small"
              @click="setSearchQuery(example)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchResult, LegalUnit, Jurisdiction, Publication } from '../types'

interface Props {
  initialQuery?: string
  autoFocus?: boolean
  showFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialQuery: '',
  autoFocus: true,
  showFilters: true
})

const emit = defineEmits<{
  select: [result: SearchResult]
  navigate: [unit: LegalUnit]
}>()

// Use search composable
const {
  searchQuery,
  searchResults,
  isSearching,
  searchError,
  totalResults,
  searchTime,
  currentPage,
  resultsPerPage,
  totalPages,
  filters,
  suggestions,
  searchHistory,
  performSearch,
  clearSearch,
  clearFilters,
  setSearchQuery,
  searchFromHistory,
  removeFromHistory,
  goToPage
} = useStatuteSearch()

// Use data composables for filters
const { jurisdictions, publications } = useStatuteData()

// Load data for filters
const { data: jurisdictionsData } = await useAsyncData('jurisdictions', () => 
  $fetch('/api/jurisdictions')
)

const { data: publicationsData } = await useAsyncData('publications', () =>
  $fetch('/api/publications')  
)

const jurisdictions = computed(() => jurisdictionsData.value?.data || [])
const allPublications = computed(() => publicationsData.value?.data || [])

// Filter publications by selected jurisdiction
const filteredPublications = computed(() => {
  if (!filters.value.jurisdictionId) return []
  return allPublications.value.filter(p => p.jurisdiction_id === filters.value.jurisdictionId)
})

// Unit type options for filter
const unitTypeOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Article', value: 'article' },
  { label: 'Section', value: 'section' },
  { label: 'Subsection', value: 'subsection' },
  { label: 'Paragraph', value: 'paragraph' },
  { label: 'Chapter', value: 'chapter' },
  { label: 'Part', value: 'part' }
]

// Search examples
const searchExamples = [
  '15-10-101',
  'probate code',
  'fiduciary duty',
  'trust administration',
  'guardianship'
]

// Event handlers
const onResultSelect = (result: SearchResult) => {
  emit('select', result)
  emit('navigate', result.unit)
}

const onBookmark = (unit: LegalUnit) => {
  const { toggleBookmark } = useStatuteBookmarks()
  toggleBookmark(unit)
}

const onPageChange = (event: any) => {
  const page = Math.floor(event.first / event.rows) + 1
  goToPage(page)
}

// Initialize with prop query
onMounted(() => {
  if (props.initialQuery) {
    setSearchQuery(props.initialQuery)
  }
})
</script>

<style scoped>
.statute-search {
  @apply flex flex-col h-full bg-white;
}

.search-header {
  @apply flex-shrink-0;
}

.search-results {
  @apply flex-1 overflow-auto;
}
</style>