<template>
  <NuxtLink :to="`/blog/${post.slug}`">
    <h1 class="px-8 text-center">{{ post.Title }}</h1>
    <LayoutMediaFocus
      :source="source.split('/')[2]"
      :title="post.Title"
    />
    <!--
    <LayoutMediaFocus
      :source="getStrapiUrl(post.attributes.Image)"
      :title="post.attributes.Title"
    />
    -->
  <div class="lg:px-20">
    <BlogRichText :block="post.Snippet" />
  </div>
  </NuxtLink>
</template>

<script setup>
const { post } = defineProps(['post'])
const { Image: { url: source } } = post
</script>

<style lang="scss" scoped>
a {
  color: #010101;
  h1 { color: --var('primary-500'); }
}
</style>