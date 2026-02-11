<template>
  <ClientOnly>
    <div class="grid grid-cols-1 md:grid-cols-12 px-4 sm:px-6 py-6 sm:py-12 lg:p-20 gap-6 lg:gap-8">
      <div class="col-span-1 md:col-span-7">
        <BlogFeaturedPost
          v-if="featuredPost"
          :post="featuredPost"
        />
      </div>
      <div class="col-span-1 md:col-span-5 flex items-start">
        <BlogPostListSidebar
          v-if="spotlightPosts.length"
          title="Spotlight"
          :posts="spotlightPosts"
        />
      </div>
    </div>
    <div class="px-4 sm:px-6 md:p-5">
      <BlogPostListRow
        v-if="allPostsREST.length"
        :posts="allPostsREST"
      />
    </div>
  </ClientOnly>
</template>

<script setup>
const { strapiUrl } = useAppConfig()

// All fetches use server: false to avoid
// Cloudflare Worker same-zone redirect loop

// Fetch featured post using REST
const featuredPostUrl = featuredPostQueryREST()
const {
  data: featuredResponse,
  error: featuredError,
} = await useFetch(
  `${strapiUrl}/api/featured-post?${featuredPostUrl}`,
  { server: false },
)

if (featuredError.value) {
  console.error(
    'Featured post fetch failed:',
    featuredError.value?.message ?? featuredError.value,
  )
}

const featuredPost = computed(
  () => featuredResponse.value?.data?.post ?? null,
)

// Fetch spotlight posts using REST
const spotlightUrl = spotlightPostsQueryREST()
const {
  data: spotlightResponse,
  error: spotlightError,
} = await useFetch(
  `${strapiUrl}/api/spotlight?${spotlightUrl}`,
  { server: false },
)

if (spotlightError.value) {
  console.error(
    'Spotlight fetch failed:',
    spotlightError.value?.message ?? spotlightError.value,
  )
}

const spotlightPosts = computed(
  () => dedupPosts(
    spotlightResponse.value?.data?.posts ?? [],
  ),
)

// Fetch all posts using REST
const allPostsUrl = allPostsQueryREST(9)
const {
  data: allPostsResponse,
  error: allPostsError,
} = await useFetch(
  `${strapiUrl}/api/posts?${allPostsUrl}`,
  { server: false },
)

if (allPostsError.value) {
  console.error(
    'All posts fetch failed:',
    allPostsError.value?.message ?? allPostsError.value,
  )
}

const allPostsREST = computed(
  () => allPostsResponse.value?.data ?? [],
)

// SEO Meta Tags for Blog Home
const { href: fullPath } = useRequestURL()

useHead({
  title: 'Legal Resources & Insights | The Law Offices of Owen Hathaway',
  meta: [
    {
      name: 'description',
      content: 'Expert legal insights on estate planning, bankruptcy, small business law, and elder care from Colorado attorney Owen Hathaway. Practical advice for life and legacy planning.',
    },
    { property: 'og:title', content: 'Legal Resources & Insights | The Law Offices of Owen Hathaway' },
    {
      property: 'og:description',
      content: 'Expert legal insights on estate planning, bankruptcy, small business law, and elder care from Colorado attorney Owen Hathaway. Practical advice for life and legacy planning.',
    },
    { property: 'og:url', content: fullPath },
    { property: 'og:image', content: `${fullPath.split('/blog')[0]}/img/blog_header.webp` },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'The Law Offices of Owen Hathaway' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Legal Resources & Insights | OHLaw Colorado' },
    {
      name: 'twitter:description',
      content: 'Expert legal insights on estate planning, bankruptcy, small business law, and elder care from Colorado attorney Owen Hathaway.',
    },
    { name: 'twitter:image', content: `${fullPath.split('/blog')[0]}/img/blog_header.webp` },
  ],
})
</script>
