<template>
  <li>
    <template v-for="child in item.children">
      <BlogRichTextModifier v-if="isModifier(child)" :brick="child" />
      <BlogRichTextLink v-else-if="child.type === 'link'" :brick="child"/>
      <template v-else>{{ child.text }}</template>
    </template>
  </li>
</template>

<script setup>
const { item } = defineProps(['item'])
</script>