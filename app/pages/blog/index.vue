<template>
  <ClientOnly>
    <div class="grid grid-cols-1 md:grid-cols-12 px-4 sm:px-6 py-6 sm:py-12 lg:p-20 gap-6 lg:gap-8">
      <div class="col-span-1 md:col-span-7">
        <BlogFeaturedPost :post="featuredPost"/>
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
const {
  data: {
    value: {
      featuredPost: {
        post: featuredPost 
      }
    }
  }
} = await useAsyncQuery(featuredPostQuery)

let {
  data: {
    value: {
      spotlight: {
        posts: spotlightPosts 
      }
    }
  }
} = await useAsyncQuery(spotlightPostsQuery)
spotlightPosts = dedupPosts(spotlightPosts)

const fetchUrl = allPostsQueryREST(9)
const { strapiUrl } = useAppConfig()
const { data: { value: { data: allPostsREST } } } = await useFetch(`${strapiUrl}/api/posts?${fetchUrl}`)
</script>