<template>
  <h1 class="text-center mt-12">Pick a tag to see related articles</h1>
  <div class="grid grid-cols-12 p-12">
    <div class="md:col-span-7 p-4">
    <Badge
      v-for="tag in data"
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

let {
  data: {
    value: {
      spotlight: {
        posts: spotlightPosts 
      }
    }
  }
} = await useAsyncQuery(spotlightPostsQuery)
spotlightPosts = dedupPosts(spotlightPosts)

// const { data } = await useAsyncQuery(postsQuery)
const query = qs.stringify({
    fields: [
      'Name',
      'slug'
    ],
    pagination: {
      pageSize: 100,
      page: 1
    },
    locale: [
      'en'
    ]
  },
  { encode: false }
)
const { data: { value: { data } } } = await useFetch(`${strapiUrl}/api/tags?${query}`)
</script>