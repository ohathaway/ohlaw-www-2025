<template>
  <ClientOnly>
    <div class="grid grid-cols-12 py-12 lg:p-20">
      <div class="md:col-span-3">
      </div>
      <div class="md:col-span-8 flex items-start">
        <BlogPostList :posts="blogStore.postList" :snippet="true" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
const blogStore = useBlogStore()

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
</script>