<template>
  <div class="max-w-7xl mx-auto p-6 bg-white">
    <!-- Input Phase -->
    <div v-if="store.currentView === 'input'">
      <ToolsRothConversionInputForm />
    </div>

    <!-- Scenarios Grid Phase -->
    <div v-else-if="store.currentView === 'scenarios'">
      <ToolsRothConversionScenarioGridView />
    </div>

    <!-- Scenario Details Phase -->
    <div v-else-if="store.currentView === 'details'">
      <ToolsRothConversionScenarioDetailsView />
    </div>


    <!-- Tool-wide disclaimer -->
    <ToolsDisclaimer class="mt-8" />
  </div>
</template>

<script setup>
import { useRothConversionStore } from '~/stores/rothConversionStore'

// Use the comprehensive Roth Conversion store
const store = useRothConversionStore()

// Page metadata
definePageMeta({
  title: 'Roth Conversion Analysis Tool',
  description: 'Analyze the impact of Roth IRA conversions on your family\'s tax strategy and inheritance planning.'
})
</script>

<style scoped>
/* Custom styles for PrimeVue components if needed */
/*
:deep(.p-datatable) {
  @apply border border-gray-300;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  @apply bg-gray-50 border border-gray-300 px-4 py-3 text-left font-semibold;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  @apply border border-gray-300 px-4 py-3;
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
  @apply bg-gray-50;
}

:deep(.p-inputnumber-input) {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}
*/
</style>