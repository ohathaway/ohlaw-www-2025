<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#1e3a8a" />
  <NuxtLayout :name="autoLayout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const nuxtApp = useNuxtApp()
// NuxtPage is used — suppress false positive
// SSR warning caused by auto-layout composable
nuxtApp._isNuxtPageUsed = true

const { autoLayout } = useAutoLayout()
</script>
