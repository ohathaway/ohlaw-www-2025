<template>
  <section 
    class="relative py-20 bg-primary-700 text-center text-white" 
    :style="backgroundStyle"
  >
    <div class="container mx-auto px-4 relative z-10">
      <h1 class="text-4xl md:text-5xl font-bold mb-4" v-html="title"></h1>
      <p class="text-xl mb-8 max-w-3xl mx-auto">{{ subtitle }}</p>
      <Button 
        v-if="buttonText" 
        @click="handleButtonClick"
        :label="buttonText"
        severity="secondary"
        size="large"
        class="font-medium"
      />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  backgroundImage: {
    type: String,
    default: ''
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

const backgroundStyle = computed(() => {
  if (!props.backgroundImage) return {}
  
  return {
    backgroundImage: `linear-gradient(rgba(38, 70, 124, 0.85), rgba(27, 53, 97, 0.9)), url('${props.backgroundImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

const handleButtonClick = () => {
  if (props.buttonLink) {
    window.open(props.buttonLink, '_blank')
  }
  emit('buttonClick')
}
</script>