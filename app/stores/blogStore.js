import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBlogStore = defineStore('blog', () => {
  const searchTerm = ref()
  const searchMeta = ref({})
  const postList = ref()

  // Filter state
  const activeCategories = ref([])
  const activeTags = ref([])

  const searchPosts = async () => {
    try {
      const searchClient = useMeilisearch()
      const index = searchClient.index('post')

      const searchResult = await index.search(
        searchTerm.value,
        {
          showRankingScore: true,
          limit: 60,
          showRankingScore: true,
          attributesToRetrieve: [
            'id',
            'Title',
            'slug',
            'Snippet',
            'Image',
            'tags',
            'category',
            'publishDate'
          ]
        }
      )
      searchMeta.value.limit = searchResult.limit
      searchMeta.value.offset = searchResult.offset,
      searchMeta.value.estimatedTotalHits = searchResult.estimatedTotalHits

      postList.value = searchResult.hits

      // Clear filters when new search is performed
      activeCategories.value = []
      activeTags.value = []
    }
    catch (error) {
      console.error('failed to search post index', error)
      throw error
    }
  }

  // Computed filtered post list
  const filteredPostList = computed(() => {
    if (!postList.value || (!activeCategories.value.length && !activeTags.value.length)) {
      return postList.value || []
    }

    return postList.value.filter((post) => {
      let matchesCategory = true
      let matchesTag = true

      // Check category filter
      if (activeCategories.value.length > 0) {
        matchesCategory = post.category?.Name && activeCategories.value.includes(post.category.Name)
      }

      // Check tag filters
      if (activeTags.value.length > 0) {
        matchesTag = post.tags?.length && post.tags.some(tag => activeTags.value.includes(tag.Name))
      }

      return matchesCategory && matchesTag
    })
  })

  // Filter actions
  const updateFilters = ({ categories, tags }) => {
    activeCategories.value = categories || []
    activeTags.value = tags || []
  }

  const clearFilters = () => {
    activeCategories.value = []
    activeTags.value = []
  }

  return {
    // state
    postList,
    searchTerm,
    activeCategories,
    activeTags,

    // computed
    filteredPostList,

    // actions
    searchPosts,
    updateFilters,
    clearFilters,
  }
})
