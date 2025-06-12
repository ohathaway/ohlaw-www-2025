<template>
  <ClientOnly>
    <div class="grid grid-cols-12 py-5 lg:px-20">
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
            <div class="flex flex-wrap gap-4">
              <div class="flex gap-2">
                Sort by:
              </div>
              <div class="flex gap-2">
                <SelectButton
                  v-model="sortKey"
                  :options="sortOptions"
                />
              </div>
              <div class="flex gap-2">
                <FloatLabel variant="on">
                  <label for="searchRefine">Refine your search:</label>
                  <InputText
                    type="text"
                    name="searchRefine"
                    v-model="searchTerm"
                    fluid
                  />
                </FloatLabel>
              </div>
            </div>
          </template>
          <template #empty>
            <h5 class="p-12">No search results found</h5>
          </template>
          <template #list="slotProps">
            <BlogPostList :posts="slotProps.items" :snippet="true" />
          </template>
        </DataView>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
const blogStore = useBlogStore()
const { searchTerm } = storeToRefs(blogStore)

const sortKey = ref()
const sortOrder = ref()
const sortField = ref()
const sortOptions = ref([
  'Newest First',
  'Oldest First'
])
</script>