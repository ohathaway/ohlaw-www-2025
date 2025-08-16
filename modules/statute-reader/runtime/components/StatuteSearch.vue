<template>
  <div class="statute-search">
    <!-- Search Header -->
    <div class="search-header sr-bg-white sr-border-b sr-border-slate-200 sr-p-4">
      <!-- Main Search Input -->
      <div class="sr-relative sr-mb-4">
        <InputText
          v-model="searchQuery"
          placeholder="Search statutes (e.g., '15-10-101' or 'probate code')..."
          class="sr-w-full sr-pl-10 sr-pr-4 sr-py-3 sr-text-lg"
          @keyup.enter="performSearch(searchQuery)"
        />
        
        <Icon
          name="pi-search"
          class="sr-absolute sr-left-3 sr-top-1/2 sr-transform sr-transform-translate-y-minus-1/2 sr-text-gray-400"
        />
        
        <Button
          v-if="searchQuery"
          @click="clearSearch"
          size="small"
          text
          class="sr-absolute sr-right-2 sr-top-1/2 sr-transform sr-transform-translate-y-minus-1/2"
        >
          <Icon name="pi-times" class="sr-text-gray-400" />
        </Button>
      </div>

      <!-- Advanced Filters -->
      <Collapsible>
        <template #trigger="{ expanded, toggle }">
          <Button
            @click="toggle"
            text
            size="small"
            class="sr-mb-2"
          >
            <Icon :name="expanded ? 'pi-chevron-down' : 'pi-chevron-right'" class="sr-mr-1" />
            Advanced Filters
          </Button>
        </template>
        
        <div class="sr-grid sr-grid-cols-1 md:sr-grid-cols-2 lg:sr-grid-cols-4 sr-gap-4 sr-p-4 sr-bg-slate-100 sr-rounded">
          <Select
            v-model="filters.jurisdictionId"
            :options="jurisdictions"
            option-label="name"
            option-value="id"
            placeholder="Jurisdiction"
            class="sr-w-full"
          />
          
          <Select
            v-model="filters.publicationId"
            :options="filteredPublications"
            option-label="name"
            option-value="id"
            placeholder="Publication"
            class="sr-w-full"
            :disabled="!filters.jurisdictionId"
          />
          
          <MultiSelect
            v-model="filters.unitTypes"
            :options="unitTypeOptions"
            option-label="label"
            option-value="value"
            placeholder="Unit Types"
            class="sr-w-full"
          />
          
          <div class="sr-flex sr-items-center sr-gap-4">
            <Checkbox
              v-model="filters.exactMatch"
              binary
              input-id="exact-match"
            />
            <label for="exact-match" class="sr-text-sm">Exact match</label>
            
            <Checkbox
              v-model="filters.includeRepealed"
              binary
              input-id="include-repealed"
            />
            <label for="include-repealed" class="sr-text-sm">Include repealed</label>
          </div>
        </div>
      </Collapsible>

      <!-- Search Stats -->
      <div v-if="totalResults > 0" class="sr-flex sr-items-center sr-justify-between sr-mt-4 sr-text-sm sr-text-slate-600">
        <span>
          {{ totalResults.toLocaleString() }} results found
          <span v-if="searchTime > 0">({{ searchTime }}ms)</span>
        </span>
        
        <div class="sr-flex sr-items-center sr-gap-2">
          <label for="results-per-page" class="sr-text-xs">Results per page:</label>
          <Select
            v-model="resultsPerPage"
            :options="[10, 20, 50, 100]"
            class="sr-w-20"
            size="small"
          />
        </div>
      </div>

      <!-- Search History -->
      <div v-if="searchHistory.length > 0" class="sr-mt-4">
        <p class="sr-text-sm sr-text-slate-600 sr-mb-2">Recent searches:</p>
        <div class="sr-flex sr-flex-wrap sr-gap-2">
          <Chip
            v-for="query in searchHistory.slice(0, 5)"
            :key="query"
            :label="query"
            class="sr-cursor-pointer"
            @click="searchFromHistory(query)"
            removable
            @remove="removeFromHistory(query)"
          />
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div class="search-results sr-flex-1 sr-overflow-auto">
      <!-- Loading State -->
      <div v-if="isSearching" class="sr-flex sr-items-center sr-justify-center sr-p-8">
        <ProgressSpinner size="2rem" />
        <span class="sr-ml-2 sr-text-slate-600">Searching...</span>
      </div>

      <!-- Error State -->
      <Message
        v-else-if="searchError"
        severity="error"
        :closable="false"
        class="sr-mt-4 sr-mb-4 sr-ml-4 sr-mr-4"
      >
        {{ searchError }}
      </Message>

      <!-- No Results -->
      <div
        v-else-if="searchQuery && searchResults.length === 0 && !isSearching"
        class="sr-text-center sr-p-8"
      >
        <Icon name="pi-search" class="sr-text-4xl sr-text-gray-300 sr-mb-4" />
        <h3 class="sr-text-lg sr-font-medium sr-text-slate-900 sr-mb-2">No results found</h3>
        <p class="sr-text-slate-600 sr-mb-4">
          No statutes match your search for "{{ searchQuery }}"
        </p>
        
        <!-- Suggestions -->
        <div v-if="suggestions.length > 0" class="sr-mt-4">
          <p class="sr-text-sm sr-text-slate-600 sr-mb-2">Did you mean:</p>
          <div class="sr-flex sr-flex-wrap sr-justify-center sr-gap-2">
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
      <div v-else-if="searchResults.length > 0" class="sr-p-4">
        <StatuteSearchResult
          v-for="result in searchResults"
          :key="result.unit.id"
          :result="result"
          :search-query="searchQuery"
          @select="onResultSelect"
          @bookmark="onBookmark"
          class="sr-mb-4"
        />

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="sr-flex sr-justify-center sr-mt-6">
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
        class="sr-flex sr-flex-col sr-items-center sr-justify-center sr-p-8 sr-text-slate-500"
      >
        <Icon name="pi-search" class="sr-text-4xl sr-mb-4" />
        <h3 class="sr-text-lg sr-font-medium sr-mb-2">Search Colorado Statutes</h3>
        <p class="sr-text-center sr-max-w-md">
          Enter a citation, keyword, or phrase to search through the Colorado Revised Statutes.
          Use quotes for exact phrases or specific citation formats.
        </p>
        
        <!-- Quick Search Examples -->
        <div class="sr-mt-6">
          <p class="sr-text-sm sr-font-medium sr-mb-2">Try these examples:</p>
          <div class="sr-flex sr-flex-wrap sr-gap-2">
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

// Load data for filters
const { data: jurisdictionsData } = await useAsyncData('jurisdictions', () => 
  $fetch('/api/statutes/jurisdictions')
)

const { data: publicationsData } = await useAsyncData('publications', () =>
  $fetch('/api/statutes/publications')  
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
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
}

.search-header {
  flex-shrink: 0;
}

.search-results {
  flex: 1 1 0%;
  overflow: auto;
}
</style>