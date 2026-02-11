<template>
  <h1 class="text-center mt-12">
    Pick a tag to see related articles
  </h1>
  <div class="grid grid-cols-12 p-12">
    <div class="md:col-span-7 p-4">
      <Badge
        v-for="tag in data"
        :key="tag.slug"
        class="m-3 text-bg-primary text-light"
      >
        <NuxtLink
          :to="`/blog/tags/${tag.slug}`"
        >
          {{ tag.Name }}
        </NuxtLink>
      </Badge>
    </div>
    <div class="md:col-span-5 flex items-start">
      <BlogPostListSidebar title="Spotlight" :posts="spotlightPosts" />
    </div>
  </div>
</template>

<script setup>
import qs from 'qs'

const { strapiUrl } = useAppConfig()

// Fetch spotlight posts using REST
const spotlightUrl = spotlightPostsQueryREST()
const {
  data: spotlightResponse,
  error: spotlightError,
} = await useFetch(
  `${strapiUrl}/api/spotlight?${spotlightUrl}`,
)

if (spotlightError.value) {
  console.error(
    'Spotlight fetch failed:',
    spotlightError.value?.message ?? spotlightError.value,
  )
}

let spotlightPosts
  = spotlightResponse.value?.data?.posts ?? []
spotlightPosts = dedupPosts(spotlightPosts)

const query = qs.stringify({
  fields: [
    'Name',
    'slug',
  ],
  pagination: {
    pageSize: 100,
    page: 1,
  },
  locale: [
    'en',
  ],
}, { encode: false })

const {
  data: tagsResponse,
  error: tagsError,
} = await useFetch(
  `${strapiUrl}/api/tags?${query}`,
)

if (tagsError.value) {
  console.error(
    'Tags fetch failed:',
    tagsError.value?.message ?? tagsError.value,
  )
}

const data = tagsResponse.value?.data ?? []
</script>
