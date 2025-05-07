<template>
  <div class="card m-12">
    <a :href="`/blog/${post.slug}`">
      <img
        class="card-img-top object-fit-cover"
        :src="getStrapiUrl(post.Image)"
        :title="post.Title"
      />
    </a>
    <div class="card-body">
      <span class="italic text-xl/7.5">
        {{ formatDateFull(post.publishDate) }}
      </span>
      <a :href="`/blog/${post.slug}`">
        <h3 class="card-title">{{ post.Title }}</h3>
        <p class="card-text">
          <BlogRichText :block="post.Snippet" />
        </p>
      </a>
    </div>
  </div>
</template>

<script setup>
const { post } = defineProps(['post'])
</script>

<style lang="scss" scoped>
.card-img-top { height: 300px; }
.card-body {
  height: 400px;
  overflow: auto;
  .card-text { color: #3a3a3a; }
  @media (max-width: 1025px) {
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