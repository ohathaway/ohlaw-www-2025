<template>
  <div class="post-title px-4 md:px-8 lg:px-20">
    <!-- Mobile: Stack title above image -->
    <div class="block md:hidden mb-6">
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">{{ postREST.Title }}</h1>
      <div class="w-full">
        <LayoutMediaFocus
          :source="getStrapiUrl(postREST.Image)"
          :title="postREST.Title"
        />
      </div>
    </div>
    
    <!-- Desktop: Side by side layout -->
    <div class="hidden md:grid md:grid-cols-2 md:gap-8">
      <div class="print-d-none">
        <LayoutMediaFocus
          :source="getStrapiUrl(postREST.Image)"
          :title="postREST.Title"
        />
      </div>
      <div class="flex items-center">
        <h1 class="text-3xl lg:text-4xl font-bold pb-5 leading-tight">{{ postREST.Title }}</h1>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-4 m-0 p-0">
    <div class="col-span-4 md:col-span-3 md:col-start-2">
      <ul class="tags">
        <li
          v-for="tag in postREST.tags"
          :key="tag.slug"
          class="tag me-3"
        >
          <Badge
            class="text-bg-primary text-light">
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
        <BlogTOC :content="postREST.Content" />
      </div>
    </div>
    <div class="col-span-12 md:col-span-8 lg:col-span-6 px-0 md:px-4">
      <span class="italic text-xl">{{ formatDateFull(postREST.publishDate) }}</span>
      <BlogRichText
        :block="postREST.Content"
      />
      <BlogRichText
        :block="postREST.CTA"
      />
    </div>
    <div class="col-span-12 md:col-span-4 lg:col-span-3">
      <div class="sticky-sidebar">
        <ClientOnly>
          <BlogPostListSidebar
            title="Related Articles"
            :posts="getMultipleRandom(categoryREST.posts, 5)"
            :snippet="true"
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
const slug = path.split('/').pop()

const { strapiUrl } = useAppConfig()

const postQuery = singlePostQueryREST(slug)

const {
  data: {
    value: {
      data: [postREST]
    }
  }
} = await useFetch(`${strapiUrl}/api/posts?${postQuery}`)

const category = postREST?.category?.slug ?? 
                postREST?.category?.slug ?? 
                'Uncategorized'

const categoryQuery = postListQueryREST(category)

const {
  data: {
    value: {
      data: [categoryREST]
    }
  }
} = await useFetch(`${strapiUrl}/api/categories?${categoryQuery}`)

/*
const fetchUrl = ref(`${strapiUrl}/api/categories?${restQuery}`)
console.info('fetchUrl:', fetchUrl.value)

const { 
  data: {
    value: {
      data: relatedPosts
    }
  }
} = await useFetch(fetchUrl.value)

console.info('relatedPosts:', relatedPosts)

if (relatedPosts.length > 0) {
  relatedPosts = relatedPosts.filter(relatedPost => {
    return relatedPost.documentId !== post.documentId
  })
}
*/

/*
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
*/

if (isEmpty(postREST)) {
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