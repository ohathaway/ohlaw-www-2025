<template>
  <section :class="['py-12', bgClass]">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-10">{{ title }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="(offering, index) in offerings" 
          :key="index"
          :class="columnClass"
        >
          <Card class="h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <template #content>
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-4 text-primary-700">{{ offering.title }}</h3>
                <p class="mb-4 text-slate-700">{{ offering.description }}</p>
                <ul v-if="offering.features && offering.features.length" class="space-y-2 mb-4">
                  <li v-for="(feature, fIndex) in offering.features" :key="fIndex" class="flex">
                    <i class="pi pi-bookmark text-green-500 mr-2 mt-1"></i>
                    <span v-if="!feature.isHtml" class="text-slate-700">{{ feature.text }}</span>
                    <span v-else v-html="feature.text" class="text-slate-700"></span>
                  </li>
                </ul>
                <slot :name="`offering-${index}`" :offering="offering"></slot>
              </div>
            </template>
          </Card>
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
  offerings: {
    type: Array,
    required: true
  },
  columns: {
    type: Number,
    default: 2,
    validator: (value) => [1, 2, 3, 4].includes(value)
  },
  background: {
    type: String,
    default: 'light',
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
  }
  return classes[props.background] || ''
})

const columnClass = computed(() => {
  const colClasses = {
    1: 'col-span-1',
    2: 'col-span-1',
    3: 'col-span-1 md:col-span-1 lg:col-span-4',
    4: 'col-span-1 md:col-span-1 lg:col-span-3'
  }
  return colClasses[props.columns] || 'col-span-1'
})
</script>
