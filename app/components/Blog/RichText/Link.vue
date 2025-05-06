<template>
  <a
    :href="brick.url"
    target="_blank"
    :title="brick.text"
  >
    <template v-for="child in brick.children">
      <BlogRichTextModifier v-if="isModifier(child)" :brick="child" />
      <template v-else>{{ child.text }}</template>
    </template>
  </a>
</template>

<script setup>
const { brick } = defineProps(['brick'])
</script>