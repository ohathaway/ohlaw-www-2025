<template>
  <div class="post-list-wrapper">
    <div class="list-title pb-4 border-b">
      <h3>{{ title }}</h3>
    </div>
    <div class="list-entries">
      <div class="entry" v-for="(post, index) in posts" :key="index">
        <div class="entry-wrapper ms-0 py-4 border-b border-gray-300">
          <span class="italic">
            {{ formatDateFull(post.publishDate) }}
          </span>
          <div class="grid grid-cols-4">
            <div class="col-span-4 lg:col-span-3">
              <NuxtLink
                :to="`/blog/${post.slug}`"
              >
                <h4 class="text-xl">{{  post.Title }}</h4>
              </NuxtLink>
              <Tag v-for="tag in post.tags" class="me-3">
                <NuxtLink
                  :to="`/blog/tags/${tag.slug}`"
                >
                  {{ tag.Name }}
                </NuxtLink>
              </Tag>
            </div>
            <div v-if="snippet" class="col-span-3 pe-4">
              <BlogRichText :block="post.Snippet" />
              <NuxtLink :to="`/blog/${post.slug}`">
                read more...
              </NuxtLink>
            </div>
            <div class="col-span-1 hidden lg:block">
              <NuxtLink
                :to="`/blog/${post.slug}`"
              >
                <LayoutMediaListing
                  :source="getStrapiThumbnailUrl(post.Image)"
                  :title="post.Title"
                />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { posts, snippet, title } = defineProps({
  posts: Array,
  snippet: Boolean,
  title: String
})
</script>

<style scoped>
a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.badge.text-bg-primary a {
  color: #ffffff;
}

.list-title h3 {
  font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif;
  font-weight: bold;
  letter-spacing: 2px;
}</style>