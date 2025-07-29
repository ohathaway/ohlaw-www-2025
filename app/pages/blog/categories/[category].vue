<template>
  <div class="category-page lg:p-20">
    <!-- Hero Section with Rich Text and Image -->
    <section v-if="categoryData && categoryData.hero" class="bg-light">
      <div class="container mx-auto">
        <h1 class="text-3xl mb-6 relative">
          Category: {{ toTitleCase(category, '-') }}
          <span class="block absolute bg-primary" style="height: 3px; width: 70px; bottom: -10px; left: 0;" />
        </h1>

        <div class="relative clearfix">
          <!-- Direct image with controlled width -->
          <div class="float-right ml-8 mb-6 w-full lg:w-[600px] max-w-full">
            <NuxtImg
              v-if="categoryData.Image"
              :provider="'strapi'"
              :src="getStrapiUrl(categoryData.Image)"
              :alt="toTitleCase(category, '-') + ' Category'"
              class="w-full rounded-xl shadow-md border border-gray-200"
              placeholder
            />
            <img
              v-else
              src="/img/placeholder_1024.webp"
              :alt="toTitleCase(category, '-') + ' Category'"
              class="w-full rounded-xl shadow-md border border-gray-200"
            >
          </div>

          <!-- Text content -->
          <div>
            <BlogRichText :block="categoryData.hero" />
          </div>
        </div>
      </div>
    </section>

    <!-- Article Section -->
    <section class="py-5 mt-3">
      <div class="container">
        <h2 class="text-center mb-4">
          {{ toTitleCase(category, '-') }} <span v-if="category === 'being-human'"> - as if you needed the practice</span>
        </h2>
        <ClientOnly>
          <BlogPostListRow :posts="posts" />
        </ClientOnly>
      </div>
    </section>

    <!-- FAQ Section (if available) -->
    <section v-if="categoryData && categoryData.faq && categoryData.faq.length" class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-4">
          Frequently Asked Questions
        </h2>
        <FaqAccordion :faq-items="categoryData.faq" />
      </div>
    </section>
  </div>
</template>

<script setup>
const { params: { category } } = useRoute()
const categoryData = ref(null)

const restQuery = postListQueryREST(category)
const { strapiUrl } = useAppConfig()
const fetchUrl = ref(`${strapiUrl}/api/categories?${restQuery}`)
const { data: categoryResponseREST } = await useFetch(fetchUrl.value)

// Extract category data if it exists
if (categoryResponseREST.value.data.length > 0) {
  // console.debug('extracting category data...')
  categoryData.value = categoryResponseREST.value.data[0]
}

const posts = ref(dedupPosts(categoryResponseREST?.value?.data[0]?.posts))

// Meta tags for SEO
useHead({
  title: `${toTitleCase(category, '-')} Articles | OH Law`,
  meta: [
    { name: 'description', content: `Browse our collection of ${toTitleCase(category, '-')} articles and resources.` },
  ],
})
</script>
