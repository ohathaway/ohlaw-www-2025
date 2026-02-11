<template>
  <li>
    <template v-for="(child, index) in item.children" :key="index">
      <BlogRichTextModifier v-if="isModifier(child)" :brick="child" />
      <BlogRichTextLink v-else-if="child.type === 'link'" :brick="child" />
      <template v-else>
        {{ child.text }}
      </template>
    </template>
  </li>
</template>

<script setup lang="ts">
import type { RichTextChild } from '~/types/blog'

const { item } = defineProps<{
  item: RichTextChild
}>()
</script>
