import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBlogStore = defineStore('blog', () => {
  const searchTerm = ref()
  const searchMeta = ref({})
  const postList = ref()

  const searchPosts = async () => {
    try {
      const searchClient = useMeilisearch()
      const index = searchClient.index('post')

      const searchResult = await index.search(searchTerm.value)
      searchMeta.value.limit = searchResult.limit
      searchMeta.value.offset = searchResult.offset,
      searchMeta.value.estimatedTotalHits = searchResult.estimatedTotalHits

      postList.value = searchResult.hits
    } catch (error) {
      console.error('failed to search post index', error)
      throw error
    }
  }

  return {
    // state
    postList,
    searchTerm,

    // actions
    searchPosts
  }
})