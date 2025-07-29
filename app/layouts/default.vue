<template>
  <NuxtLayout name="base">
    <template #specialized-header />
    <slot />
  </NuxtLayout>
  <ClientOnly>
    <FloatingCta
      v-if="showFloatingCta"
      :scroll-threshold="300"
    />
    <BookingDialog />
  </ClientOnly>
</template>

<script setup>
const route = useRoute()
const { floatingCta: { alwaysPaths, neverPaths } } = useAppConfig()

const showFloatingCta = computed(() => {
  const routeInAlwaysPaths = alwaysPaths.some(path => route.path.startsWith(path))
  const routeInNeverPaths = neverPaths.some(path => route.path.startsWith(path))
  /*
    routeInNeverPaths = true : should return false
    routeInAlwaysPaths = true : should return true
    both routeInNeverPaths and routeInAlwaysPaths = false : should return true
  */
  return routeInAlwaysPaths || !routeInNeverPaths
})
</script>
