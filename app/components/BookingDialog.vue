<template>
  <Dialog
    v-model:visible="visible"
    modal
    maximizable
    contentClass="bg-stone-300"
    class="w-[95vw] max-w-6xl"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <template #header>
      <NuxtImg
        class="w-11 sm:w-14 md:w-16 ml-4 sm:ml-8 md:ml-16 mr-4 sm:mr-8 md:mr-16 float-left"
        src="/img/ohlaw_icon_circle_gray.svg"
        title="OHLaw"
        provider="cloudflare"
      />
      <h2 class="text-center flex-1 text-lg sm:text-xl md:text-2xl px-2 sm:px-4">Which of our services would you like to speak with us about?</h2>
      <!-- < type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
    </template>
    <div class="py-4 sm:py-8 md:py-12 lg:py-20 px-2 sm:px-4">
      <SchedulingCards />
    </div>
  </Dialog>
</template>

<script setup>
const { bookingDialogVisible: visible } = storeToRefs(useMainStore())
</script>

