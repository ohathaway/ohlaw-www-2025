<template>
  <ul>
    <BlogRichTextListItem v-for="(child, index) in brick.children" :key="index" :item="child" />
  </ul>
</template>

<script setup lang="ts">
import type { RichTextBlock } from '~/types/blog'

const { brick } = defineProps<{
  brick: RichTextBlock
}>()
</script>
