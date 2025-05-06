<template>
  <ul>
    <BlogRichTextListItem v-for="child in brick.children" :item="child" />
  </ul>
</template>

<script setup>
const { brick } = defineProps(['brick'])
</script>