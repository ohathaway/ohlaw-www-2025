<template>
  <!-- Personalization Introduction Section -->
  <div v-if="!personalizationMode && !showingTables" class="mt-8 mb-6">
    <Card class="bg-gradient-to-r from-primary-50 to-info-50 border border-primary-200">
      <template #content>
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <i class="pi pi-chart-line text-primary-600 text-2xl"></i>
              <h3 class="text-lg font-semibold text-primary-800">Want to see how YOUR specific situation affects these results?</h3>
            </div>
            <p class="text-primary-700 text-sm mb-0">
              These scenarios use standard assumptions. Personalize the analysis with your actual tax rates, 
              timeline, and family situation to see how Roth conversions could impact your specific circumstances.
            </p>
          </div>
          <div class="ml-6">
            <Button
              @click="$emit('enable-personalization')"
              severity="primary"
              size="large"
              icon="pi pi-cog"
              label="Personalize This Analysis"
              class="px-6 py-3 font-semibold"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>

  <!-- Personalization Mode Indicator -->
  <div v-if="personalizationMode && !showingTables" class="mt-8 mb-4">
    <!-- Baseline Selection Required State -->
    <div v-if="!selectedBaseline" class="relative">
      <Card class="bg-warning-50 border border-warning-300">
        <template #content>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="pi pi-exclamation-circle text-warning-600 text-2xl"></i>
              <div>
                <h3 class="text-lg font-semibold text-warning-800 mb-1">Choose a baseline scenario to start personalizing</h3>
                <p class="text-warning-700 text-sm">Select one of the preset scenarios below as your comparison baseline</p>
              </div>
            </div>
            <Button
              @click="$emit('disable-personalization')"
              severity="secondary"
              icon="pi pi-arrow-left"
              label="Back to Standard View"
              size="small"
              class="shrink-0"
            />
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Baseline Selected State -->
    <div v-else class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Tag 
          value="🎯 Custom Analysis Mode" 
          severity="success" 
          class="text-sm font-semibold px-4 py-2"
          icon="pi pi-target"
        />
        <span class="text-slate-600 text-sm">
          Baseline: <strong>{{ selectedBaseline.scenario.name }}</strong> | Ready to personalize
        </span>
      </div>
      <div class="flex gap-2">
        <Button
          @click="$emit('open-personalization-modal')"
          severity="primary"
          icon="pi pi-sliders-h"
          label="Personalize"
          size="small"
        />
        <Button
          @click="$emit('change-baseline')"
          severity="secondary"
          icon="pi pi-refresh"
          label="Change Baseline"
          size="small"
        />
        <Button
          @click="$emit('disable-personalization')"
          severity="secondary"
          icon="pi pi-arrow-left"
          label="Back to Standard"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  personalizationMode: {
    type: Boolean,
    required: true
  },
  selectedBaseline: {
    type: Object,
    default: null
  },
  showingTables: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'enable-personalization',
  'disable-personalization',
  'change-baseline',
  'open-personalization-modal'
])
</script>

<style scoped>
/* No specific styles needed - using global PrimeVue and Tailwind classes */
</style>