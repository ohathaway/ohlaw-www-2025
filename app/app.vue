<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout :name="autoLayout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { autoLayout } = useAutoLayout()
</script>
