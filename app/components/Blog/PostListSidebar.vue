<template>
  <aside>
    <BlogPostList 
      :posts="posts"
      :title="title"
      :snippet="false"
    />
  </aside>
</template>

<script setup>
const { posts, title } = defineProps(['posts', 'title'])
</script>