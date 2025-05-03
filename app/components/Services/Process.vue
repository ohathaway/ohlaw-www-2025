<template>
  <section :id="id" :class="['py-12', bgClass]">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-8">{{ title }}</h2>
      <p v-if="description" class="text-center text-lg mb-10 max-w-4xl mx-auto">{{ description }}</p>
      
      <div class="relative">
        <!-- Timeline with PrimeVue Timeline component -->
        <Timeline :value="processSteps" layout="vertical" align="alternate">
          <template #content="slotProps">
            <Card class="mb-3">
              <template #title>
                {{ slotProps.item.title }}
              </template>
              <template #content>
                <p>{{ slotProps.item.description }}</p>
              </template>
            </Card>
          </template>
          <template #opposite="slotProps">
            <div class="flex justify-center items-center h-full">
              <span class="p-3 border-2 border-primary-500 bg-white rounded-full shadow-md text-primary-700 font-bold">
                {{ slotProps.index + 1 }}
              </span>
            </div>
          </template>
          <template #marker="slotProps">
            <span class="flex w-5 h-5 border-4 border-primary-500 bg-white rounded-full shadow-md"></span>
          </template>
          <template #connector>
            <div class="h-full w-1 bg-primary-300"></div>
          </template>
        </Timeline>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    default: 'service-process'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  processSteps: {
    type: Array,
    required: true
  },
  background: {
    type: String,
    default: '',
    validator: (value) => ['', 'light', 'primary', 'secondary', 'dark'].includes(value)
  }
})

const bgClass = computed(() => {
  const classes = {
    '': '',
    'light': 'bg-slate-100',
    'primary': 'bg-primary-100',
    'secondary': 'bg-slate-200',
    'dark': 'bg-slate-800 text-white'
  };
  return classes[props.background] || ''
})
</script>