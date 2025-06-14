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
                  defaultValue="Newest First"
                  class="text-xs"
                  @change="onSortChange($event)"
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

const sortKey = ref()
const sortOrder = ref()
const sortField = ref()
const sortOptions = ref([
  { option: 'Newest First', index: 1 },
  { option: 'Oldest First', index: -1 }
])

console.debug('route:', route.query.search)

const onSortChange = event => {
  sortPosts(event.value)
}

const sortedPosts = order => {
  blogStore.postList.sort((a, b) => {
    const dateA = new Date(a.publishDate)
    const dateB = new Date(b.publishDate)
    
    if (order === 'Newest First') {
      return dateB - dateA // Newest first
    } else {
      return dateA - dateB // Oldest first
    }
  })
}

onMounted(() => {
  try {
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