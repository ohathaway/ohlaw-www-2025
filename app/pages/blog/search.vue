<template>
  <ClientOnly>
    <div class="grid md:grid-cols-12 py-5 lg:px-20">
      <div class="md:col-span-12 mx-auto"><h1 class="text-2xl">Search Results</h1></div>
      <div class="md:col-span-3">
      </div>
      <div class="md:col-span-8 flex items-start">
        <DataView
          :value="blogStore.postList"
          :sortOrder="sortOrder"
          :sortField="sortField"
          paginator
          :rows="5"
          :pt="{ root: 'w-full' }"
        >
          <template #header>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-slate-50 rounded-lg border">
              <!-- Search - Primary action -->
              <div class="flex-1 max-w-md">
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
              
              <!-- Sort controls - Secondary -->
              <div class="flex items-center gap-3 text-sm">
                <span class="text-slate-600 whitespace-nowrap">Sort by:</span>
                <SelectButton
                  v-model="sortKey"
                  :options="sortOptions"
                  option-label="label"
                  option-value="value"
                  class="text-xs"
                  @change="onSortChange"
                />
              </div>
            </div>
          </template>
          <template #empty>
            <h5 class="p-12">No search results found</h5>
          </template>
          <template #list="slotProps">
            <div class="p-5">
              <BlogPostList :posts="slotProps.items" :snippet="true" />
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
const route = useRoute()

const blogStore = useBlogStore()
const { searchTerm } = storeToRefs(blogStore)

// DataView sorting state
const sortKey = ref('newest')
const sortOrder = ref(-1) // -1 for descending (newest first), 1 for ascending (oldest first)
const sortField = ref('publishDate')

// Sort options for SelectButton
const sortOptions = ref([
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' }
])

const onSortChange = () => {
  if (sortKey.value === 'newest') {
    sortOrder.value = -1 // Descending order (newest first)
  } else {
    sortOrder.value = 1  // Ascending order (oldest first)
  }
  // sortField stays 'publishDate' for both options
}

onMounted(() => {
  try {
    // Set default sort
    sortKey.value = 'newest'
    sortOrder.value = -1
    sortField.value = 'publishDate'
    
    if (route.query.search) {
      searchTerm.value = route.query.search
      blogStore.searchPosts()
    }
  } catch (error) {
    console.error('failed to initiate search:', error)
    throw error
  }
})
</script>