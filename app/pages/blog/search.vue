<template>
  <ClientOnly>
    <div class="py-5 lg:px-20">
      <div class="mb-6">
        <h1 class="text-2xl">
          Search Results
        </h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-3 order-2 lg:order-1">
          <BlogSearchSidebar
            :posts="blogStore.postList || []"
            :active-categories="blogStore.activeCategories"
            :active-tags="blogStore.activeTags"
            @filter-change="handleFilterChange"
          />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-9 order-1 lg:order-2">
          <DataView
            :value="blogStore.filteredPostList"
            :sort-order="sortOrder"
            :sort-field="sortField"
            paginator
            :rows="5"
            :pt="{ root: 'w-full' }"
          >
            <template #header>
              <div class="flex flex-col gap-4 p-4 bg-slate-50 rounded-lg border">
                <!-- Search - Primary action -->
                <div class="w-full sm:max-w-md">
                  <FloatLabel variant="on">
                    <InputText
                      id="searchRefine"
                      v-model="searchTerm"
                      fluid
                      class="text-sm"
                    />
                    <label for="searchRefine" class="text-sm text-slate-600">Refine your search</label>
                  </FloatLabel>
                </div>

                <!-- Results count and sort controls -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <span class="text-slate-600 text-sm order-2 sm:order-1">
                    {{ filteredResultsCount }} result{{ filteredResultsCount !== 1 ? 's' : '' }}
                  </span>
                  <div class="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 order-1 sm:order-2">
                    <span class="text-slate-600 text-sm whitespace-nowrap">Sort by:</span>
                    <SelectButton
                      v-model="sortKey"
                      :options="sortOptions"
                      option-label="label"
                      option-value="value"
                      class="text-xs w-full xs:w-auto"
                      :pt="{
                        root: 'w-full xs:w-auto',
                        button: 'text-xs px-2 py-1 sm:px-3 sm:py-2',
                      }"
                      @change="onSortChange"
                    />
                  </div>
                </div>
              </div>
            </template>
            <template #empty>
              <div class="text-center py-12">
                <i class="pi pi-search text-4xl text-gray-400 mb-4 block" />
                <h5 class="text-lg text-gray-600 mb-2">
                  No search results found
                </h5>
                <p class="text-gray-500 text-sm">
                  {{ hasActiveFilters ? 'Try adjusting your filters or search terms.' : 'Try different search terms.' }}
                </p>
              </div>
            </template>
            <template #list="slotProps">
              <div class="p-5">
                <BlogPostList :posts="slotProps.items" :snippet="true" />
              </div>
            </template>
          </DataView>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
const route = useRoute()

const blogStore = useBlogStore()
const { searchTerm, activeCategories, activeTags, filteredPostList } = storeToRefs(blogStore)

// DataView sorting state
const sortKey = ref('mostRelevant')
const sortOrder = ref(-1) // -1 for descending (newest first), 1 for ascending (oldest first)
const sortField = ref('_rankingScore')

// Sort options for SelectButton
const sortOptions = ref([
  { label: 'Most Relevant', value: 'mostRelevant' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
])

// Computed properties
const filteredResultsCount = computed(() => {
  return filteredPostList.value?.length || 0
})

const hasActiveFilters = computed(() => {
  return activeCategories.value.length > 0 || activeTags.value.length > 0
})

// Methods
const onSortChange = () => {
  if (sortKey.value === 'newest') {
    sortField.value = 'publishDate'
    sortOrder.value = -1 // Descending order (newest first)
  }
  else if (sortKey.value === 'oldest') {
    sortField.value = 'publishDate'
    sortOrder.value = 1 // Ascending order (oldest first)
  } else if (sortKey.value === 'mostRelevant') {
    sortField.value = '_rankingScore'
    sortOrder.value = -1 // Descending order (most relevant first)
  }
}

const handleFilterChange = (filters) => {
  blogStore.updateFilters(filters)
}

// Watch for search term changes to trigger new searches
watch(searchTerm, async (newTerm) => {
  if (newTerm && newTerm.trim()) {
    await blogStore.searchPosts()
  }
}, { debounce: 300 })

onMounted(() => {
  try {
    // Set default sort
    sortKey.value = 'mostRelevant'
    sortOrder.value = -1
    sortField.value = '_rankingScore'

    if (route.query.search) {
      searchTerm.value = route.query.search
      blogStore.searchPosts()
    }
  }
  catch (error) {
    console.error('failed to initiate search:', error)
    throw error
  }
})
</script>
