<template>
  <template v-if="brick.code">
    <pre>{{ brick.text }}</pre>&nbsp;
  </template>
  <template v-else>
    <span :class="classes">{{ brick.text }}</span>&nbsp;
  </template>
</template>

<script setup lang="ts">
import type { RichTextChild } from '~/types/blog'

const { brick } = defineProps<{
  brick: RichTextChild
}>()

const classes = computed(() => {
  const list: string[] = []
  if (brick.bold) list.push('font-bold')
  if (brick.italic) list.push('italic')
  if (brick.underline) list.push('underline')
  if (brick.strikethrough) list.push('line-through')
  return list
})
</script>
