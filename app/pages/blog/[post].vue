<template>
  <div v-if="postREST">
    <div class="post-title px-4 md:px-8 lg:px-20">
      <!-- Mobile: Stack title above image -->
      <div class="block md:hidden mb-6">
        <div class="mb-4">
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {{ postREST.Title }}
          </h1>
        </div>
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
          <div class="flex-1">
            <h1 class="text-3xl lg:text-4xl font-bold pb-5 leading-tight">
              {{ postREST.Title }}
            </h1>
          </div>
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
              class="text-bg-primary text-light"
            >
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
        <div class="flex items-center justify-between mb-4">
          <span class="italic text-xl">{{ formatDateFull(postREST.publishDate) }}</span>
          <BlogPDFDownloadButton
            :slug="postREST.slug"
            :title="postREST.Title"
          />
        </div>
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
              v-if="categoryREST?.posts?.length"
              title="Related Articles"
              :posts="getMultipleRandom(categoryREST.posts, 5)"
              :snippet="true"
            />
          </ClientOnly>
        </div>
      </div>
    </article>
  </div>
  <div
    v-else
    class="flex justify-center items-center min-h-96"
  >
    <p class="text-xl text-gray-500">
      Loading article...
    </p>
  </div>
</template>

<script setup>
const { path } = useRoute()
const slug = path.split('/').pop()

const { strapiUrl } = useAppConfig()

// All fetches use server: false to avoid
// Cloudflare Worker same-zone redirect loop

const postQuery = singlePostQueryREST(slug)

const {
  data: postResponse,
  error: postError,
} = await useFetch(
  `${strapiUrl}/api/posts?${postQuery}`,
  { server: false },
)

if (postError.value) {
  console.error(
    'Blog post fetch failed:',
    postError.value?.message ?? postError.value,
  )
}

const postREST = computed(
  () => postResponse.value?.data?.[0] ?? null,
)

// Category fetch uses computed URL that
// reacts to post data arriving
const categoryFetchUrl = computed(() => {
  const cat = postREST.value?.category?.slug
    ?? 'Uncategorized'
  return `${strapiUrl}/api/categories?${
    postListQueryREST(cat)
  }`
})

const {
  data: categoryResponse,
  error: categoryError,
} = await useFetch(
  categoryFetchUrl,
  { server: false },
)

if (categoryError.value) {
  console.error(
    'Category fetch failed:',
    categoryError.value?.message ?? categoryError.value,
  )
}

const categoryREST = computed(
  () => categoryResponse.value?.data?.[0] ?? null,
)

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

// SEO and Social Media Meta Tags
const { href: fullPath } = useRequestURL()
const { strapiUrl: baseUrl } = useAppConfig()

// Generate description from content or use excerpt
const description = computed(() => {
  const post = postREST.value
  if (post?.Snippet) {
    const plainText = richTextToPlainText(post.Snippet)
    return plainText.length >= 100
      ? plainText
      : `${plainText} Learn more about this important topic and how it affects you.`
  }
  return 'Read this insightful article by The Law Offices of Owen Hathaway. Expert legal guidance on estate planning, bankruptcy, and small business law in Colorado.'
})

// Generate image URL
const imageUrl = computed(() => {
  const post = postREST.value
  if (post?.Image) {
    const strapiImageUrl = getStrapiUrl(post.Image)
    return strapiImageUrl.startsWith('http')
      ? strapiImageUrl
      : `${baseUrl}${strapiImageUrl}`
  }
  return `${fullPath.split('/blog')[0]}/img/ohlaw_icon_circle_gray.svg`
})

const pageTitle = computed(
  () => postREST.value?.Title
    || 'Blog Post - OHLaw Colorado',
)

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: fullPath },
    { property: 'og:image', content: imageUrl },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'The Law Offices of Owen Hathaway' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    { property: 'article:author', content: 'Owen Hathaway' },
    {
      property: 'article:published_time',
      content: () => postREST.value?.publishDate,
    },
    {
      property: 'article:modified_time',
      content: () => postREST.value?.updatedAt,
    },
  ],
})

useSeoMeta({
  articleModifiedTime: () => postREST.value?.updatedAt,
})
</script>

<style>
ul.tags {
  list-style-type: none;
}
li.tag {
  display: inline;
}
li.tag a {
  color: #f8f8f8;
}

@media print {
  .post-list-wrapper {
    display: none;
  }
}
</style>
