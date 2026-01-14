<template>
  <ul>
    <BlogRichTextListItem v-for="(child, index) in brick.children" :key="index" :item="child" />
  </ul>
</template>

<script setup>
const { brick } = defineProps(['brick'])
</script>
