<template>
  <NuxtLink :to="`/blog/${post.slug}`">
    <h1 class="px-4 sm:px-6 md:px-8 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-6">{{ post.Title }}</h1>
    <div class="mb-4 sm:mb-6">
      <LayoutMediaFocus
        :source="source.split('/')[2]"
        :title="post.Title"
      />
    </div>
    <!--
    <LayoutMediaFocus
      :source="getStrapiUrl(post.attributes.Image)"
      :title="post.attributes.Title"
    />
    -->
    <div class="px-4 sm:px-6 md:px-12 lg:px-20">
      <BlogRichText :block="post.Snippet" />
    </div>
  </NuxtLink>
</template>

<script setup>
const { post } = defineProps(['post'])
const { Image: { url: source } } = post
</script>

<style scoped>
a {
  color: #010101;
}
a h1 { 
  color: var(--primary-500); 
}
</style>
