<template>
  <div class="px-5 w-full justify-content-center">
    <h2 class="text-center pt-5 pb-3">
      Articles Related to {{ toTitleCase(tag, '-') }}
    </h2>
    <ClientOnly>
      <BlogPostListRow
        v-if="posts.length"
        :posts="posts"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
const { params: { tag } } = useRoute()

const restQuery = postListQueryREST(tag, 'tag', 6)
const { strapiUrl } = useAppConfig()
const fetchUrl = `${strapiUrl}/api/tags?${restQuery}`

// server: false avoids Cloudflare Worker
// same-zone redirect loop
const {
  data: tagResponseREST,
  error: tagError,
} = await useFetch(fetchUrl, { server: false })

if (tagError.value) {
  console.error(
    'Tag fetch failed:',
    tagError.value?.message ?? tagError.value,
  )
}

const tagData = computed(
  () => tagResponseREST.value?.data?.[0] ?? null,
)

const posts = computed(
  () => dedupPosts(tagData.value?.posts ?? []),
)
</script>
