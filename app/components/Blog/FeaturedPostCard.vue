<template>
  <ClientOnly>
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-0">
          <!-- Blog Post Image -->
          <div class="md:col-span-1">
            <div class="h-full min-h-[200px] bg-cover bg-center" 
                :style="{ backgroundImage: `url('${getStrapiUrl(featuredPost.Image)}')` }">
              <div class="h-full bg-stone-600/20"></div>
            </div>
          </div>
          
          <!-- Blog Post Content -->
          <div class="col-span-1 md:col-span-2 p-6 md:p-8">
            <div class="flex items-center mb-3">
              <span class="text-xs text-stone-500 uppercase tracking-wider">
                {{ formatDateFull(featuredPost.publishDate) }}
              </span>
              <span class="mx-2 text-stone-300">|</span>
              <span class="text-xs text-primary-600 uppercase tracking-wider">
                {{ featuredPost.category?.Name || 'Legal Insights' }}
              </span>
            </div>
            
            <h3 class="text-xl md:text-2xl font-semibold mb-4 text-slate-800 leading-tight">
              {{ featuredPost.Title }}
            </h3>
            
            <p class="text-slate-600 mb-6 leading-relaxed">
              <BlogRichText :block="featuredPost.Snippet || featuredPost.Content" />
            </p>
            
            <div class="flex justify-between items-center">
              <NuxtLink 
                :to="`/blog/${featuredPost.slug}`"
                class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Read Full Article
                <i class="pi pi-arrow-right ml-2"></i>
              </NuxtLink>
              
              <NuxtLink 
                to="/blog"
                class="text-stone-500 hover:text-stone-600 text-sm transition-colors float-right"
              >
                Browse All Articles →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
const featuredPost = ref(null)

try {
  // Use the same featured post query as your blog page
  const { data } = await useAsyncQuery(featuredPostQuery)
  if (data.value?.featuredPost?.post) {
    featuredPost.value = data.value.featuredPost.post
  }
} catch (error) {
  console.error('Failed to fetch featured post:', error)
  // Gracefully handle error - page still works without featured post
}
</script>