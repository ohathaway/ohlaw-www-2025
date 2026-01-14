<template>
  <a
    :href="brick.url"
    target="_blank"
    :title="brick.text"
  >
    <template v-for="(child, index) in brick.children" :key="index">
      <BlogRichTextModifier v-if="isModifier(child)" :brick="child" />
      <template v-else>{{ child.text }}</template>
    </template>
  </a>
</template>

<script setup>
const { brick } = defineProps(['brick'])
</script>
