<template>
  <section class="py-12 bg-primary-100">
    <div class="container mx-auto px-4">
      <h1 class="text-5xl text-center my-5">Our Main Practice Areas</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Loop through services -->
        <div 
          v-for="(service, index) in services" 
          :key="service.id"
          class="relative overflow-hidden rounded-lg transition-all duration-300"
          :class="{ 'h-80': !expandedService || expandedService !== service.id, 'md:h-auto': expandedService === service.id }"
        >
          <!-- Background image -->
          <div 
            class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            :style="{ backgroundImage: `url('${service.image}')` }"
            role="img"
            :aria-label="service.imageAlt"
          >
            <div class="absolute inset-0 bg-primary-800 opacity-40 hover:opacity-50 transition-opacity"></div>
          </div>
          
          <!-- Content area -->
          <div class="relative h-full p-6 flex flex-col justify-between z-10">
            <div>
              <h3 class="text-white text-2xl font-semibold mb-4"><span v-html="service.title" /></h3>
              
              <!-- Description shown when expanded -->
              <p 
                v-show="expandedService === service.id" 
                class="text-white mb-4 animate-fadeIn"
              >
                <span v-html="service.description" />
              </p>
              
              <!-- Short preview shown when collapsed -->
              <p v-show="expandedService !== service.id" class="text-white mb-4">
                <span v-html="service.shortPreview" />
              </p>
            </div>
            
            <!-- Controls -->
            <div class="flex justify-between items-center">
              <NuxtLink 
                :to="service.link" 
                class="text-white uppercase text-sm tracking-wider border-b border-white pb-1 w-fit"
              >
                learn more
              </NuxtLink>
              
              <button 
                class="text-white p-2 rounded-full hover:bg-primary-700" 
                @click="toggleServiceExpansion(service.id)"
                :aria-expanded="expandedService === service.id"
                :aria-controls="`service-description-${service.id}`"
              >
                <span class="sr-only">{{ expandedService === service.id ? 'Show less' : 'Show more' }}</span>
                <i :class="expandedService === service.id ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

// Track which service is expanded
const expandedService = ref(null);

const toggleServiceExpansion = (serviceId) => {
  expandedService.value = expandedService.value === serviceId ? null : serviceId;
};

// Define services data with descriptions using backticks
const services = [
  {
    id: 'estate-planning',
    title: 'Estate Planning<br />That Works',
    image: '/img/estatenotebook_1024.webp',
    imageAlt: 'Estate planning notebook with pen and documents',
    link: '/services/estate-planning',
    shortPreview: `We help you avoid pain and expense for your loved ones.`,
    description: `We help you create plans that actually work for what happens to you and your estate when you no longer can express them. Our estate planning services ensure your life's accomplishments are properly passed on to the people and causes you care about.`
  },
  {
    id: 'small-business',
    title: 'Small Business<br />Foundations',
    image: '/img/business1_1024.webp',
    imageAlt: 'Small business owner working on legal documents',
    link: '/services/small-business',
    shortPreview: `Legal foundations for your business growth and success.`,
    description: `As small business owners ourselves, we understand the challenges you face. From entity selection to contracts and liability management, we help you build a solid legal foundation so you can focus on growing your business.`
  },
  {
    id: 'nonprofits',
    title: 'Sustainable<br />Nonprofits',
    image: '/img/dotorgtablet_1024.webp',
    imageAlt: 'Nonprofit organization documents on tablet',
    link: '/services/nonprofits',
    shortPreview: `Sustainable structures for mission-driven organizations.`,
    description: `We help nonprofits set up for long-term sustainability with the right structure and compliance. Our experience with both small businesses and nonprofits gives us unique insight into creating organizations that balance mission with operational stability.`
  },
  {
    id: 'bankruptcy',
    title: 'Heart-Centered Bankruptcy',
    image: '/img/helpinghand_1024.webp',
    imageAlt: 'Helping hand extended for financial relief',
    link: '/services/bankruptcy',
    shortPreview: `Clear your financial path forward with our bankruptcy services.`,
    description: `When financial obstacles are blocking your view of what's important, our bankruptcy program can help. We believe everyone deserves the opportunity to pursue their dreams regardless of past financial setbacks.`
  }
]
</script>

<style>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>