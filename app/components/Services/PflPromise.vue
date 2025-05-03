<template>
  <section :class="['py-12', backgroundClass]">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-10">{{ title }}</h2>
      <div class="flex justify-center">
        <div class="w-full max-w-5xl">
          <Card class="border-0 shadow-lg">
            <template #content>
              <div class="p-6 md:p-8">
                <h3 class="text-2xl font-semibold text-primary-700 mb-4">Planning That Works</h3>
                <p class="text-lg mb-8">We create plans that keep your family out of court and out of conflict while protecting everything you care about from predators and the government - keeping it all in your chosen family's hands.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div class="flex">
                    <i class="pi pi-calendar-plus text-4xl text-primary-500 mr-4"></i>
                    <div>
                      <h4 class="text-xl font-medium mb-2">Our 3-Meeting Process</h4>
                      <p class="text-slate-700">Our structured approach ensures your plan actually gets completed. Far too many estate plans end up unfinished, unsigned, or out-of-date. We've designed our process to overcome procrastination and neglect.</p>
                    </div>
                  </div>
                  <div class="flex">
                    <i class="pi pi-dollar text-4xl text-primary-500 mr-4"></i>
                    <div>
                      <h4 class="text-xl font-medium mb-2">Transparent Flat Fees</h4>
                      <p class="text-slate-700">You'll never be surprised by an unexpected invoice. All of our fees are flat fees, agreed to in advance, based on your choices, with no surprises, ensuring we stay on the same side of the table every step of the way.</p>
                    </div>
                  </div>
                  <div class="flex">
                    <i class="pi pi-users text-4xl text-primary-500 mr-4"></i>
                    <div>
                      <h4 class="text-xl font-medium mb-2">Relationship-Based Planning</h4>
                      <p class="text-slate-700">Every Life & Legacy Plan is unique, driven by your personal relationships, family dynamics, assets, risk factors, and budget. We map out the most likely scenarios for you and plan for each as life changes.</p>
                    </div>
                  </div>
                  <div class="flex">
                    <i class="pi pi-sync text-4xl text-primary-500 mr-4"></i>
                    <div>
                      <h4 class="text-xl font-medium mb-2">3-Year Review Process</h4>
                      <p class="text-slate-700">We ensure your plan stays up to date as your life changes. Our review process is designed to maintain the effectiveness of your plan over time, unlike traditional estate planning that often goes stale.</p>
                    </div>
                  </div>
                </div>
                
                <div v-if="showWhyItMatters" class="bg-slate-100 p-6 rounded-lg mt-8">
                  <h5 class="text-lg font-semibold mb-3">Why This Matters</h5>
                  <p class="text-slate-700">Planning is something you do for the people you love. By the time those people need the planning you did (or didn't do), you'll either be unable to make decisions for yourself or have passed on. Our approach is about cleaning up the mess you'll leave behind for the people you love, before they have to deal with it themselves.</p>
                </div>
                
                <div v-if="$slots.default" class="mt-6">
                  <slot></slot>
                </div>
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
    default: 'The Personal Family Lawyer Promise'
  },
  background: {
    type: String,
    default: 'light', // Options: light, white, primary, secondary
    validator: (value) => ['light', 'white', 'primary', 'secondary'].includes(value)
  },
  showWhyItMatters: {
    type: Boolean,
    default: true
  }
})

const backgroundClass = computed(() => {
  const classes = {
    'light': 'bg-slate-100',
    'white': '',
    'primary': 'bg-primary-100',
    'secondary': 'bg-slate-200'
  }
  return classes[props.background] || 'bg-slate-100'
})
</script>