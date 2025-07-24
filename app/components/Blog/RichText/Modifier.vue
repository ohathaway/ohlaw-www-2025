<template>
  <pre v-if="brick.code">{{ brick.text }}</pre>&nbsp;
  <span v-else :class="classes">{{ brick.text }}</span>&nbsp;
</template>

<script setup>
const { brick } = defineProps(['brick'])

const classes = computed(() => {
  const list = []
  if (brick.bold) list.push('font-bold')
  if (brick.italic) list.push('italic')
  if (brick.underline) list.push('underline')
  if (brick.strikethrough) list.push('line-through')
  return list
})
</script>
