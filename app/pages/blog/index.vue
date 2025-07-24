<template>
  <ClientOnly>
    <div class="grid grid-cols-1 md:grid-cols-12 px-4 sm:px-6 py-6 sm:py-12 lg:p-20 gap-6 lg:gap-8">
      <div class="col-span-1 md:col-span-7">
        <BlogFeaturedPost :post="featuredPost" />
      </div>
      <div class="col-span-1 md:col-span-5 flex items-start">
        <BlogPostListSidebar title="Spotlight" :posts="spotlightPosts" />
      </div>
    </div>
    <!-- <BlogSignup /> -->
    <div class="px-4 sm:px-6 md:p-5">
      <BlogPostListRow :posts="allPostsREST" />
    </div>
  </ClientOnly>
</template>

<script setup>
const { strapiUrl } = useAppConfig()

// Fetch featured post using REST
const featuredPostUrl = featuredPostQueryREST()
const { data: { value: { data: featuredPostData } } } = await useFetch(`${strapiUrl}/api/featured-post?${featuredPostUrl}`)
const featuredPost = featuredPostData?.post

// Fetch spotlight posts using REST
const spotlightUrl = spotlightPostsQueryREST()
const { data: { value: { data: spotlightData } } } = await useFetch(`${strapiUrl}/api/spotlight?${spotlightUrl}`)
let spotlightPosts = spotlightData?.posts || []
spotlightPosts = dedupPosts(spotlightPosts)

// Fetch all posts using REST
const fetchUrl = allPostsQueryREST(9)
const { data: { value: { data: allPostsREST } } } = await useFetch(`${strapiUrl}/api/posts?${fetchUrl}`)

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
