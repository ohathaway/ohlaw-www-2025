<template>
  <div class="px-5 w-full justify-content-center">
    <h2 class="text-center pt-5 pb-3">
      Articles Related to {{ toTitleCase(tag, '-') }}
    </h2>
    <ClientOnly>
      <BlogPostListRow :posts="posts" />
    </ClientOnly>
  </div>
</template>

<script setup>
const { params: { tag } } = useRoute()
const tagData = ref(null)

const restQuery = postListQueryREST(tag, 'tag', 6)
const { strapiUrl } = useAppConfig()
const fetchUrl = ref(`${strapiUrl}/api/tags?${restQuery}`)
// console.info('fetchUrl:', fetchUrl)
const { data: tagResponseREST } = await useFetch(fetchUrl.value)
// console.info('tagResponseREST:', tagResponseREST)

// Extract category data if it exists
if (tagResponseREST.value.data.length > 0) {
  console.info('extracting tag data...')
  tagData.value = tagResponseREST.value.data[0]
}

const posts = ref(dedupPosts(tagResponseREST?.value?.data[0]?.posts))
</script>
