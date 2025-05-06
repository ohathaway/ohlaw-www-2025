<template>
  <ol>
    <BlogRichTextListItem v-for="child in brick.children" :item="child" />
  </ol>
</template>

<script setup>
const { brick } = defineProps(['brick'])
</script>