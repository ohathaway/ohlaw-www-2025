<template>
  <section class="py-12 bg-primary-700 text-white text-center">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-4">{{ title }}</h2>
      <p class="text-xl mb-6 max-w-3xl mx-auto">{{ description }}</p>
      <Button 
        v-if="buttonText" 
        @click="handleButtonClick"
        class="font-medium"
        :label="buttonText"
        size="large"
        severity="secondary"
      />
      <slot name="custom-button"></slot>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: ''
  },
  buttonLink: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['buttonClick'])

const handleButtonClick = () => {
  if (props.buttonLink) {
    window.open(props.buttonLink, '_blank')
  }
  emit('buttonClick')
}
</script>