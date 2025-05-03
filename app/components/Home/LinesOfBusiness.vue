<template>
  <section class="py-12 bg-blue-50">
    <div class="container mx-auto px-4">
      <h1 class="text-5xl text-center my-5">Our Main Practice Areas</h1>
      <!-- <p class="text-2xl text-center my-3">We have a lot of tools in our belt, but most of what we do falls into one of these buckets.</p> -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
        <!-- Loop through services -->
        <div 
          v-for="(service, index) in services" 
          :key="service.id"
          class="relative h-80 group overflow-hidden"
        >
          <div 
            class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            :style="{ backgroundImage: `url('${service.image}')` }"
          >
            <div class="absolute inset-0 bg-primary-800 opacity-40"></div>
          </div>
          <div class="relative h-full p-6 flex flex-col justify-between z-10">
            <div>
              <h3 class="text-white text-2xl font-semibold mb-4">{{ service.title }}</h3>
            </div>
            <NuxtLink 
              :to="service.link" 
              class="text-white uppercase text-sm tracking-wider border-b border-white pb-1 w-fit"
            >
              learn more
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Define services data
const services = [
  {
    id: 'estate-planning',
    title: 'Estate Planning',
    image: '/img/estatenotebook_1024.webp',
    // link: '/services/estate-planning'
    link: '/'
  },
  {
    id: 'small-business',
    title: 'Small Business',
    image: '/img/business1_1024.webp',
    // link: '/services/small-business'
    link: '/'
  },
  {
    id: 'nonprofits',
    title: 'Nonprofits',
    image: '/img/dotorgtablet_1024.webp',
    // link: '/services/nonprofits'
    link: '/'
  },
  {
    id: 'bankruptcy',
    title: 'Bankruptcy',
    image: '/img/helpinghand_1024.webp',
    // link: '/services/bankruptcy'
    link: '/'
  }
]
</script>