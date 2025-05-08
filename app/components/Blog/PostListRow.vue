<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-content-center">
    <div v-for="post in posts" class="col">
      <BlogCard :post="post" />
    </div>
  </div>
</template>

<script setup>
const { posts } = defineProps({
  posts: Object
})
</script>