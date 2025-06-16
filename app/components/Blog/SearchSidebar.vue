<template>
  <div class="search-sidebar bg-white border border-gray-200 rounded-lg p-4 h-fit">
    <!-- Active Filters Section -->
    <div v-if="hasActiveFilters" class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">
        Active Filters
      </h3>
      <div class="space-y-2">
        <!-- Active Categories -->
        <div v-for="category in activeCategories" :key="category" class="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
          <span class="text-sm text-blue-800">
            <i class="pi pi-folder text-xs mr-1" />
            {{ category }}
          </span>
          <Button
            icon="pi pi-times"
            size="small"
            text
            severity="danger"
            class="p-1 w-6 h-6"
            @click="removeFilter('category', category)"
          />
        </div>
        <!-- Active Tags -->
        <div v-for="tag in activeTags" :key="tag" class="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2">
          <span class="text-sm text-green-800">
            <i class="pi pi-tag text-xs mr-1" />
            {{ tag }}
          </span>
          <Button
            icon="pi pi-times"
            size="small"
            text
            severity="danger"
            class="p-1 w-6 h-6"
            @click="removeFilter('tag', tag)"
          />
        </div>
      </div>
      <Button
        label="Clear All Filters"
        icon="pi pi-filter-slash"
        size="small"
        outlined
        severity="secondary"
        class="w-full mt-3"
        @click="clearAllFilters"
      />
      <Divider />
    </div>

    <!-- Categories Section -->
    <div v-if="availableCategories.length" class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <i class="pi pi-folder text-blue-600 mr-2" />
        Categories
      </h3>
      <div class="space-y-1">
        <Button
          v-for="category in availableCategories"
          :key="category.slug"
          :label="`${category.name} (${category.count})`"
          :outlined="!activeCategories.includes(category.name)"
          :severity="activeCategories.includes(category.name) ? 'primary' : 'secondary'"
          size="small"
          class="w-full justify-start text-left"
          @click="toggleFilter('category', category.name)"
        />
      </div>
    </div>

    <!-- Tags Section -->
    <div v-if="availableTags.length">
      <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <i class="pi pi-tag text-green-600 mr-2" />
        Tags
      </h3>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="tag in availableTags"
          :key="tag.slug"
          :label="`${tag.name} (${tag.count})`"
          :outlined="!activeTags.includes(tag.name)"
          :severity="activeTags.includes(tag.name) ? 'secondary' : 'secondary'"
          size="small"
          @click="toggleFilter('tag', tag.name)"
        />
      </div>
    </div>

    <!-- No Filters Available -->
    <div v-if="!availableCategories.length && !availableTags.length" class="text-center text-gray-500 py-8">
      <i class="pi pi-filter text-2xl mb-2 block" />
      <p class="text-sm">
        No filters available
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
  activeCategories: {
    type: Array,
    default: () => [],
  },
  activeTags: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['filter-change'])

// Computed properties for available filters
const availableCategories = computed(() => {
  const categoryMap = new Map()

  props.posts.forEach((post) => {
    if (post.category?.Name) {
      const name = post.category.Name
      const slug = post.category.slug
      if (categoryMap.has(name)) {
        categoryMap.set(name, {
          ...categoryMap.get(name),
          count: categoryMap.get(name).count + 1,
        })
      }
      else {
        categoryMap.set(name, { name, slug, count: 1 })
      }
    }
  })

  return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name))
})

const availableTags = computed(() => {
  const tagMap = new Map()

  props.posts.forEach((post) => {
    if (post.tags?.length) {
      post.tags.forEach((tag) => {
        const name = tag.Name
        const slug = tag.slug
        if (tagMap.has(name)) {
          tagMap.set(name, {
            ...tagMap.get(name),
            count: tagMap.get(name).count + 1,
          })
        }
        else {
          tagMap.set(name, { name, slug, count: 1 })
        }
      })
    }
  })

  return Array.from(tagMap.values()).sort((a, b) => b.count - a.count)
})

const hasActiveFilters = computed(() => {
  return props.activeCategories.length > 0 || props.activeTags.length > 0
})

// Filter methods
const toggleFilter = (type, value) => {
  const currentFilters = type === 'category' ? [...props.activeCategories] : [...props.activeTags]
  const index = currentFilters.indexOf(value)

  if (index > -1) {
    currentFilters.splice(index, 1)
  }
  else {
    currentFilters.push(value)
  }

  emit('filter-change', {
    categories: type === 'category' ? currentFilters : props.activeCategories,
    tags: type === 'tag' ? currentFilters : props.activeTags,
  })
}

const removeFilter = (type, value) => {
  toggleFilter(type, value)
}

const clearAllFilters = () => {
  emit('filter-change', {
    categories: [],
    tags: [],
  })
}
</script>

<style scoped>
.search-sidebar {
  min-width: 250px;
}
</style>
