<template>
  <ol>
    <BlogRichTextListItem v-for="(child, index) in brick.children" :key="index" :item="child" />
  </ol>
</template>

<script setup lang="ts">
import type { RichTextBlock } from '~/types/blog'

const { brick } = defineProps<{
  brick: RichTextBlock
}>()
</script>
