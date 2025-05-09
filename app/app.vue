<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#1e3a8a"/>
  <NuxtLayout :name="autoLayout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { autoLayout } = useAutoLayout()
</script>
