<template>
  <div class="post-list-wrapper">
    <div class="list-title pb-3 sm:pb-4 border-b">
      <h3 class="text-lg sm:text-xl">
        {{ title }}
      </h3>
    </div>
    <div class="list-entries">
      <article v-for="(post, index) in posts" :key="index" class="entry">
        <div class="entry-wrapper ms-0 py-3 sm:py-4 border-b border-gray-300">
          <span class="italic text-sm sm:text-base">
            {{ formatDateFull(post.publishDate) }}
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-0">
            <div class="col-span-1 sm:col-span-4 lg:col-span-3">
              <NuxtLink
                :to="`/blog/${post.slug}`"
              >
                <h4 class="text-lg sm:text-xl">{{ post.Title }}</h4>
              </NuxtLink>
              <div class="flex flex-wrap gap-2 mt-2">
                <Tag v-for="tag in post.tags" class="text-xs sm:text-sm">
                  <NuxtLink
                    :to="`/blog/tags/${tag.slug}`"
                  >
                    {{ tag.Name }}
                  </NuxtLink>
                </Tag>
              </div>
            </div>
            <div v-if="snippet" class="col-span-1 sm:col-span-3 pe-0 sm:pe-4 mt-2 sm:mt-0">
              <BlogRichText :block="post.Snippet" />
              <NuxtLink :to="`/blog/${post.slug}`" class="text-sm">
                read more...
              </NuxtLink>
            </div>
            <div class="col-span-1 sm:col-span-1 hidden md:block lg:block mt-2 sm:mt-0">
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
      </article>
    </div>
  </div>
</template>

<script setup>
const { posts, snippet, title } = defineProps({
  posts: Array,
  snippet: Boolean,
  title: String,
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
}
</style>
