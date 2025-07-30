<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
    <!-- Estate Planning Card -->
    <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <a :href="schedulingLinks.estatePlanEducation" class="block no-underline">
        <div class="p-4 bg-white text-center min-h-[100px] flex flex-col justify-center">
          <h3 class="text-xl font-semibold text-slate-800">Schedule for Estate Planning</h3>
        </div>
        <div class="relative overflow-hidden h-[200px]">
          <NuxtImg
            src="/img/estatenotebook_1024.webp"
            alt="Estate Planning"
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            provider="cloudflare"
          />
        </div>
      </a>
    </div>

    <!-- Small Business Card -->
    <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <a :href="schedulingLinks.newBusinessClient" class="block no-underline">
        <div class="p-4 bg-white text-center min-h-[100px] flex flex-col justify-center">
          <h3 class="text-xl font-semibold text-slate-800">Schedule for Small Business</h3>
        </div>
        <div class="relative overflow-hidden h-[200px]">
          <NuxtImg
            src="/img/business1_1024.webp"
            alt="Small Business"
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            provider="cloudflare"
          />
        </div>
      </a>
    </div>

    <!-- Bankruptcy Card -->
    <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <a :href="schedulingLinks.newBankruptcyClient" class="block no-underline">
        <div class="p-4 bg-white text-center min-h-[100px] flex flex-col justify-center">
          <h3 class="text-xl font-semibold text-slate-800">Schedule for Bankruptcy</h3>
        </div>
        <div class="relative overflow-hidden h-[200px]">
          <NuxtImg
            src="/img/helpinghand_1024.webp"
            alt="Bankruptcy"
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            provider="cloudflare"
          />
        </div>
      </a>
    </div>

    <!-- Nonprofits Card -->
    <div class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <a :href="schedulingLinks.newNonprofitClient" class="block no-underline">
        <div class="p-4 bg-white text-center min-h-[100px] flex flex-col justify-center">
          <h3 class="text-xl font-semibold text-slate-800">Schedule for Nonprofits</h3>
        </div>
        <div class="relative overflow-hidden h-[200px]">
          <NuxtImg
            src="/img/dotorgtablet_1024.webp"
            alt="Nonprofits"
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            provider="cloudflare"
          />
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
const { schedulingLinks } = useAppConfig()
</script>