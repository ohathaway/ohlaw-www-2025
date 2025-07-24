<template>
  <div class="media-listing-wrapper">
    <img
      class="w-full border rounded-lg"
      :src="props.source"
      :title="props.title"
    >
  </div>
</template>

<script setup>
const props = defineProps(['source', 'title'])
</script>
