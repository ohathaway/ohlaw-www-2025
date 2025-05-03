<template>
  <section class="py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div class="pt-10">
          <h2 class="text-4xl font-bold text-slate-800 mb-4"><span v-html="title"></span></h2>
          <p class="mb-4 text-slate-700" v-html="description" />
          <ul v-if="features.length" class="space-y-4 mb-6 pe-10">
            <li v-for="(feature, index) in features" :key="index" class="flex text-xl">
              <i class="pi pi-check-circle text-primary-500 mr-3 mt-1"></i>
              <div>
                <strong class="text-slate-900">{{ feature.title }}: </strong> 
                <span v-html="feature.description" class="text-slate-700"></span>
              </div>
            </li>
          </ul>
          <slot name="additional-content"></slot>
        </div>
        <div>
          <div class="rounded-lg overflow-hidden shadow-md">
            <NuxtImg 
              :src="imageSource" 
              :alt="imageTitle" 
              class="w-full h-auto object-cover"
              provider="cloudflare"
            />
          </div>
          <div v-if="buttonText" class="text-center mt-6">
            <Button 
              @click="handleButtonClick"
              :label="buttonText"
              severity="primary"
              size="large"
              class="font-medium"
            />
          </div>
        </div>
      </div>
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
  features: {
    type: Array,
    default: () => []
  },
  imageSource: {
    type: String,
    required: true
  },
  imageProvider: {
    type: String,
    default: 'cloudflare'
  },
  imageTitle: {
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

const handleButtonClick = () => {
  if (props.buttonLink) {
    window.open(props.buttonLink, '_blank')
  }
  emit('buttonClick')
}
</script>