<template>
  <ol>
    <BlogRichTextListItem v-for="(child, index) in brick.children" :key="index" :item="child" />
  </ol>
</template>

<script setup>
const { brick } = defineProps(['brick'])
</script>
