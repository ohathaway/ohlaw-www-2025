<template>
  <Dialog
    v-model:visible="visible"
    modal
    maximizable
    contentClass="bg-stone-300"
  >
    <template #header>
      <NuxtImg
        class="logo-icon float-left"
        src="/img/ohlaw_icon_circle_gray.svg"
        title="OHLaw"
        provider="cloudflare"
      />
      <h2 class="text-center w-[70%]">Which of our services would you like to speak with us about?</h2>
      <!-- < type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
    </template>
    <div class="py-20">
      <SchedulingCards />
    </div>
  </Dialog>
</template>

<script setup>
const { bookingDialogVisible: visible } = storeToRefs(useMainStore())
</script>

<style scoped>
.logo-icon {
  width: 65px;
  margin-left: 4rem;
  margin-right: 4rem;
}
</style>