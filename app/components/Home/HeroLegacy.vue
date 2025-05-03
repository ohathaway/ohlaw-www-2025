<template>
  <section 
    class="relative w-full h-[462px] bg-cover bg-center flex items-center justify-center" 
    :style="{ backgroundImage: `url(${heroImage})` }"
  >
    <div class="row flex items-center w-full">
      <div class="col w-full">
        <div class="mx-auto w-3/5 py-8 px-32 bg-[hsla(0,0%,25%,0.5)]">
          <h1 class="text-center text-white text-[400%] font-[200]">
            Reach for your dreams
          </h1>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import heroImage from '@/assets/img/horsetooth_hiker_1275_485_smallest.jpg'
</script>