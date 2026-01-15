<template>
  <template v-if="brick.code">
    <pre>{{ brick.text }}</pre>&nbsp;
  </template>
  <template v-else>
    <span :class="classes">{{ brick.text }}</span>&nbsp;
  </template>
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
