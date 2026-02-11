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
const fetchUrl = `${strapiUrl}/api/tags?${restQuery}`

const {
  data: tagResponseREST,
  error: tagError,
} = await useFetch(fetchUrl)

if (tagError.value) {
  console.error(
    'Tag fetch failed:',
    tagError.value?.message ?? tagError.value,
  )
}

const tagItems = tagResponseREST.value?.data ?? []

if (tagItems.length > 0) {
  tagData.value = tagItems[0]
}

const posts = ref(
  dedupPosts(tagItems[0]?.posts ?? []),
)
</script>
