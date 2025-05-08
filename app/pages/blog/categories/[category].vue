<template>
  <div class="category-page lg:p-20">
    <!-- Hero Section with Rich Text and Image -->
    <section v-if="categoryData && categoryData.hero" class="bg-light">
      <div class="grid grid-cols-12 align-items-center">
        <div class="col-span-12 lg:col-span-7 lg:pe-5">
          <h1 class="text-3xl mb-4 relative">
            Category: {{ toTitleCase(category, '-') }}
            <span class="block absolute bg-primary" style="height: 3px; width: 70px; bottom: -10px; left: 0;"></span>
          </h1>
          <BlogRichText :block="categoryData.hero" class="float-left" />
            <LayoutMediaFocus 
              v-if="categoryData.Image"
              :source="getStrapiUrl(categoryData.Image)"
              provider="strapi"
              :title="toTitleCase(category, '-') + ' Category'"
              class="rounded overflow-hidden shadow min-h-[400px] float-right w-3xl"
            />
            <!-- Fallback if no image -->
            <div v-else class="rounded overflow-hidden shadow">
              <img src="/img/placeholder_1024.webp" alt="Category placeholder" class="img-fluid" />
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
        <h2 class="text-center mb-4">Frequently Asked Questions</h2>
        <FaqAccordion :faqItems="categoryData.faq" />
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
    { name: 'description', content: `Browse our collection of ${toTitleCase(category, '-')} articles and resources.` }
  ]
})
</script>