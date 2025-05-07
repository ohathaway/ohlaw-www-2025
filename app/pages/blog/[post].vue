<template>
  <div class="grid grid-cols-2 post-title px-20">
    <div class="col-span 2 md:col-1 print-d-none">
      <LayoutMediaFocus
        :source="getStrapiUrl(post.Image)"
        :title="post.Title"
      />
    </div>
    <div class="col-span-2 md:col-span-1 flex items-center">
      <h1 class="pb-5">{{ post.Title }}</h1>
    </div>
  </div>
  <div class="grid grid-cols-4 m-0 p-0">
    <div class="col-span-4 md:col-span-3 md:col-start-2">
    <ul class="tags">
      <li
        v-for="tag in post.tags"
        class="tag me-3"
      >
        <Badge
          class="badge rounded-pill text-bg-primary text-light">
          <NuxtLink
            :to="`/blog/tags/${tag.slug}`"
          >
            {{ tag.Name }}
          </NuxtLink>
        </Badge>
      </li>
    </ul>
    </div>
  </div>
  <article class="grid grid-cols-12 p-8 post-display">
    <div class="col-span-3 hidden lg:block">
      <div class="sticky">
        <BlogTOC :content="post.Content" />
      </div>
    </div>
    <div class="col-span-12 md:col-span-8 lg:col-span-6 px-4">
      <span class="italic text-xl">{{ formatDateFull(post.publishDate) }}</span>
      <BlogRichText
        :block="post.Content"
      />
      <BlogRichText
        :block="post.CTA"
      />
    </div>
    <div class="col-span-12 md:col-span-4 lg:col-span-3">
      <div class="sticky-sidebar">
        <ClientOnly>
          <BlogPostListSidebar
            title="Related Articles"
            :posts="getMultipleRandom(relatedPosts, 5)"
          />
        </ClientOnly>
      </div>
    </div>
  </article>
</template>

<script setup>
/*
definePageMeta({
  layout: 'blog'
})
*/

const { path } = useRoute()

const {
  data: {
   value: { posts: [post] }
  }
} = await useAsyncQuery(singlePostQuery(path.split('/').pop()))

const category = post?.category?.slug ?? 
                post?.category?.slug ?? 
                'Uncategorized'

const restQuery = postListQueryREST(category)
const { strapiUrl } = useAppConfig()
const fetchUrl = ref(`${strapiUrl}/api/categories?${restQuery}`)
// console.info('fetchUrl:', fetchUrl.value)
const {
  data: {
    value: {
      data: [
        { posts: relatedPosts }
      ]
    }
  }
} = await useFetch(fetchUrl.value)

relatedPosts.value = relatedPosts.filter(relatedPost => {
  return relatedPost.documentId !== post.documentId
})

const { href: fullPath  } = useRequestURL()

const description = richTextToPlainText(post.Snippet)

useHead({
  title: post.Title,
  meta: [
    { hid: 'og:title', property: 'og:title', content: post.Title },
    { hid: 'og:url', property: 'og:url', content: fullPath },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'og:image', property: 'og:image', content: `${process.env.baseUrl}/${getStrapiUrl(post.Image)}` }
  ]
})

useSeoMeta({
  // will be inferred as the lastmod value in the sitemap
  articleModifiedTime: getDateAsPaddedString(post.updatedAt)
})

if (isEmpty(post)) {
  showError({'404': 'Page not found'})
}
</script>

<style lang="scss">
ul.tags { list-style-type: none; }
li.tag { 
  display: inline;
  a { color: #f8f8f8;}
} 

@media print {
  .post-list-wrapper {
    display: none;
  }
}
</style>