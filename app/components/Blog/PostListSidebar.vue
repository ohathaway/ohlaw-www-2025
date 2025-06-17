<template>
  <aside>
    <BlogPostList 
      :posts="posts"
      :title="title"
      :snippet="snippet"
    />
  </aside>
</template>

<script setup>
const { posts, title, snippet } = defineProps({
  posts: {
    type: Array
  },
  snippet: {
    type: Boolean,
    default: false
  },
  title: {
    type: String
  }
})
</script>