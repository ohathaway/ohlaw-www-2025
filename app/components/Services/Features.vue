<template>
  <section :class="['py-12', bgClass]">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-6">
        {{ title }}
      </h2>
      <p v-if="description" class="text-center text-lg mb-8 max-w-4xl mx-auto">
        {{ description }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          :class="columnClass"
        >
          <Card class="h-full shadow-sm hover:shadow-md transition-shadow duration-300">
            <template #content>
              <div class="flex flex-col items-center text-center p-6">
                <!-- PrimeVue Icon -->
                <i
                  v-if="feature.icon"
                  :class="`bi bi-${feature.icon} text-orange-900 text-4xl mb-4`"
                />

                <!-- Font Awesome Icon -->
                <font-awesome-icon
                  v-else-if="feature.faIcon"
                  :icon="parseFontAwesomeIcon(feature.faIcon)"
                  class="text-orange-900 text-4xl mb-4"
                />

                <h3 class="text-xl font-semibold mb-3 text-primary-700">
                  {{ feature.title }}
                </h3>
                <p class="text-slate-700">
                  {{ feature.description }}
                </p>
                <slot :name="`feature-${index}`" :feature="feature" />
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
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  features: {
    type: Array,
    required: true,
  },
  columns: {
    type: Number,
    default: 3,
    validator: value => [1, 2, 3, 4, 6].includes(value),
  },
  background: {
    type: String,
    default: '',
    validator: value => ['', 'light', 'primary', 'secondary', 'dark'].includes(value),
  },
})

const bgClass = computed(() => {
  const classes = {
    '': '',
    'light': 'bg-slate-100',
    'primary': 'bg-primary-100',
    'secondary': 'bg-slate-200',
    'dark': 'bg-slate-800 text-white',
  }
  return classes[props.background] || ''
})

const columnClass = computed(() => {
  const colClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-1',
    3: 'col-span-1',
    4: 'col-span-1 md:col-span-1 lg:col-span-3',
    6: 'col-span-1 md:col-span-1 lg:col-span-2',
  }
  return colClasses[props.columns] || 'col-span-1'
})
</script>
