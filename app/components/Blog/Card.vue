<template>
  <a :href="`/blog/${post.slug}`">
    <Card class="overflow-auto m-5 h-[38rem]">
      <template #header>
        <div class="overflow-hidden h-[15rem]">
          <NuxtImg
            :src="getStrapiUrl(post.Image)"
            :alt="post.Title"
            provider="strapi"
            class="w-full h-full"
          />
        </div>
      </template>
      <template #title>
        <h3 class="card-title text-primary text-2xl">{{ post.Title }}</h3>
      </template>
      <template #subtitle>
        <span class="italic">
          {{ formatDateFull(post.publishDate) }}
        </span>
      </template>
      <template #content>
        <p class="card-text">
          <BlogRichText :block="post.Snippet" />
        </p>
      </template>
    </Card>
  </a>
</template>

<script setup>
const { post } = defineProps(['post'])
</script>

<style scoped>
.card-img-top {
  height: 300px;
}
.card-body {
  height: 400px;
  overflow: auto;
}
.card-body .card-text {
  color: #3a3a3a;
}
@media (max-width: 1025px) {
  .card-body {
    height: auto;
    overflow: clip;
  }
}

/*
@media (max-width: 1025px) {
  .card-body {
    width: 225px;
  }
}
*/
</style>
