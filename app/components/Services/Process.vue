<template>
  <section :id="id" class="py-12 relative diffusion-background" :class="bgClass">
    <!-- Diffusion background overlay -->
    <div class="absolute inset-0 overflow-hidden">
      <svg
        class="absolute top-0 left-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Define filter for diffusion effect -->
        <defs>
          <filter
            id="diffusion"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="1000" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -11" />
          </filter>

          <!-- Gradients for the shapes -->
          <linearGradient
            id="grad1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stop-color="var(--primary-200)" />
            <stop offset="100%" stop-color="var(--primary-300)" />
          </linearGradient>

          <linearGradient
            id="grad2"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stop-color="var(--primary-300)" />
            <stop offset="100%" stop-color="var(--primary-400)" />
          </linearGradient>
        </defs>

        <!-- Shapes to apply the diffusion effect to -->
        <g opacity="0.03">
          <!-- Organic shape 1 -->
          <path d="M1300,300 Q1100,100 900,400 T500,300 T200,500 T0,300 V800 H1440 V300" fill="url(#grad1)" filter="url(#diffusion)" />

          <!-- Organic shape 2 -->
          <path d="M0,600 Q300,750 600,550 T1000,650 T1440,450 V800 H0 V600" fill="url(#grad2)" filter="url(#diffusion)" />
        </g>
      </svg>
    </div>

    <!-- Content container with z-index -->
    <div class="container mx-auto px-4 relative z-10">
      <h2 class="text-3xl font-bold text-center mb-8">
        {{ title }}
      </h2>
      <p v-if="description" class="text-center text-lg mb-10 max-w-4xl mx-auto">
        {{ description }}
      </p>

      <div class="relative">
        <!-- Timeline with PrimeVue Timeline component -->
        <Timeline :value="processSteps" layout="vertical" align="alternate">
          <template #content="slotProps">
            <Card class="mb-3 bg-slate-300">
              <template #title>
                <h4>{{ slotProps.item.info }}</h4>
              </template>
              <template #content>
                <div class="timeline-content-left" v-html="slotProps.item.content" />
              </template>
            </Card>
          </template>
          <template #opposite="slotProps">
            <div class="flex justify-center items-start mt-10 h-full">
              <span class="p-3 border-2 border-primary-500 bg-stone-500 rounded-full shadow-md text-white font-bold">
                Step {{ slotProps.index + 1 }}
              </span>
            </div>
          </template>
          <template #marker="slotProps">
            <span class="flex w-5 h-5 border-4 border-primary-500 bg-white rounded-full shadow-md" />
          </template>
          <template #connector>
            <div class="h-full w-1 bg-primary-300" />
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
    default: 'service-process',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  processSteps: {
    type: Array,
    required: true,
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
</script>

<style scoped>
.timeline-content-left {
  text-align: left;
}
diffusion-background {
  position: relative;
}

:deep(ul) {
  list-style-type: none;
  padding-left: 0;
  margin-top: 0.5rem;
}

:deep(ul li) {
  position: relative;
  padding-left: 1.75rem;
  margin-bottom: 0.75rem;
}

:deep(ul li::before) {
  position: absolute;
  left: 0;
  top: 0.25rem;
  font-family: "PrimeIcons";
  content: "\e98c"; /* PrimeIcon code for pi-chevron-right */
  color: #f59e0b;
}
</style>
