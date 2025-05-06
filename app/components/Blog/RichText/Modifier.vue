<template>
  <pre v-if="brick.code">{{ brick.text }}</pre>&nbsp;
  <span :class="classes" v-else>{{ brick.text }}</span>&nbsp;
</template>

<script setup>
const { brick } = defineProps(['brick'])

const classes = computed(() => {
  const list = []
  if (brick.bold) list.push('fw-bold')
  if (brick.italic) list.push('fst-italic')
  if (brick.underline) list.push('text-decoration-underline')
  if (brick.strikethrough) list.push('text-decoration-line-through')
  return list
})
</script>