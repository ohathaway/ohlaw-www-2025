<template>
  <NuxtLayout name="base">
    <template #specialized-header>
      <LayoutBreadcrumbNav />
    </template>

    <slot />
  </NuxtLayout>
  <ClientOnly>
    <FloatingCta
      :scroll-threshold="300"
      :visible="showFloatingCta"
    />
    <BookingDialog />
  </ClientOnly>
</template>

<script setup>
const { showFloatingCta } = storeToRefs(useMainStore())
</script>
