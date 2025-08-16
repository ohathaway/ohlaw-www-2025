<template>
  <i :class="iconClass" />
</template>

<script setup lang="ts">
interface Props {
  name: string
}

const props = defineProps<Props>()

const iconClass = computed(() => {
  // Convert name prop to PrimeIcon class
  // Handle both 'pi-' and non-prefixed formats
  const iconName = props.name.startsWith('pi-') ? props.name : `pi-${props.name}`
  return `pi ${iconName}`
})
</script>