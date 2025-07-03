<template>
  <div class="mb-8">
    <!-- Educational Header -->
    <div class="mb-6 lg:mx-5 p-4 bg-primary-50 border border-primary-200 rounded-lg">
      <h3 class="text-lg font-semibold text-primary-800 mb-2 flex items-center gap-2">
        <i class="pi pi-chart-line text-primary-600"></i>
        What This Really Means for Your Family
      </h3>
      <p class="text-primary-700 text-sm">
        Every dollar that grows tax-free in a Roth account is a dollar your children keep instead of sending to the IRS. The chart below shows how different strategies impact what you actually leave behind.
      </p>
      <p class="text-primary-600 text-sm mt-2">
        <strong>Implementation note:</strong> These results assume properly structured trusts or beneficiary designations that allow favorable tax treatment. The legal framework matters as much as the strategy.
      </p>
    </div>

    <!-- Chart Container -->
    <div class="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <div class="h-64 md:h-80 lg:h-96">
        <Chart
          v-if="chartData && chartData.labels && chartData.labels.length > 0"
          type="bar"
          :data="chartData"
          :options="chartOptions"
          @select="handleChartClick"
          class="w-full h-full"
        />
        <div v-else class="flex items-center justify-center h-full text-slate-500">
          <div class="text-center">
            <i class="pi pi-chart-line text-4xl mb-2"></i>
            <p>{{ scenarioCalculations.length === 0 ? 'Chart will appear after calculating scenarios' : 'Loading chart...' }}</p>
            <p class="text-xs mt-1">{{ scenarioCalculations.length }} scenario(s) available</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Legend with Explanations -->
    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <div 
        v-for="(scenario, index) in scenarioCalculations" 
        :key="scenario.scenario.name"
        class="p-3 rounded-md border transition-all duration-200 cursor-pointer hover:shadow-md"
        :class="[
          getScenarioClasses(scenario.scenario, scenario.netFamilySavings, totalPreTaxAccounts),
          selectedIndex === index ? 'ring-2 ring-primary-500 ring-offset-2' : ''
        ]"
        @click="selectScenario(index)"
        role="button"
        :aria-label="`Select ${scenario.scenario.name} scenario from chart`"
        tabindex="0"
        @keydown.enter="selectScenario(index)"
        @keydown.space.prevent="selectScenario(index)"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="font-medium text-sm">{{ scenario.scenario.name }}</span>
          <i :class="getScenarioIcon(scenario.scenario)" class="text-lg"></i>
        </div>
        <div class="text-xs opacity-75">
          {{ formatCurrency(scenario.scenario.conversionAmount) }} conversion
        </div>
        <div class="text-sm font-semibold mt-1" :class="scenario.netFamilySavings < 0 ? 'text-danger-600' : 'text-success-600'">
          {{ scenario.netFamilySavings > 0 ? '+' : '' }}{{ formatCurrency(scenario.netFamilySavings) }}
        </div>
      </div>
    </div>

    <!-- Selected Scenario Indicator -->
    <div v-if="selectedScenario" class="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-md">
      <div class="flex items-center gap-2">
        <i class="pi pi-check-circle text-primary-600"></i>
        <span class="font-medium text-primary-800">
          Selected: {{ selectedScenario.scenario.name }} 
          ({{ formatCurrency(selectedScenario.scenario.conversionAmount) }} conversion, 
          {{ selectedScenario.netFamilySavings > 0 ? '+' : '' }}{{ formatCurrency(selectedScenario.netFamilySavings) }} net savings)
        </span>
      </div>
      
      
      <!-- Danger Warning -->
      <div v-if="selectedScenario.scenario.isDangerous && selectedScenario.netFamilySavings < 0" class="mt-2">
        <Tag severity="danger" value="⚠️ Family Loses Money" class="text-xs" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRothCalculations } from '~/composables/useRothCalculations'
import { formatCurrency } from '~/utils/numbers'

const props = defineProps({
  scenarioCalculations: {
    type: Array,
    required: true
  },
  totalPreTaxAccounts: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['scenario-selected'])

// Use the Roth calculations composable
const { 
  generateChartData, 
  generateChartOptions, 
  getScenarioClasses, 
  getScenarioIcon 
} = useRothCalculations()

// Chart data and options
const chartData = computed(() => {
  return generateChartData(props.scenarioCalculations, props.totalPreTaxAccounts)
})

const chartOptions = computed(() => {
  const options = generateChartOptions(props.scenarioCalculations)
  
  // Override the onClick handler to work with Vue events
  options.onClick = (event, elements) => {
    if (elements.length > 0) {
      const dataIndex = elements[0].index
      selectScenario(dataIndex)
    }
  }
  
  return options
})

// Selection state
const selectedIndex = ref(null)
const selectedScenario = ref(null)

/**
 * Handle chart click events
 * @param {Event} event - Chart.js select event
 */
const handleChartClick = (event) => {
  // Chart.js events are handled by the onClick option
  // This is here for potential future use
}

/**
 * Select scenario by index (from chart click or legend click)
 * @param {number} index - Index of scenario to select
 */
const selectScenario = (index) => {
  if (index >= 0 && index < props.scenarioCalculations.length) {
    selectedIndex.value = index
    selectedScenario.value = props.scenarioCalculations[index]
    emit('scenario-selected', props.scenarioCalculations[index])
  }
}

// Watch for changes in scenario calculations to reset selection
watch(() => props.scenarioCalculations, () => {
  selectedIndex.value = null
  selectedScenario.value = null
}, { deep: true })
</script>

<style scoped>
/* Enhanced hover effects for chart legend */
.scenario-legend-item {
  transition: all 0.2s ease;
}

.scenario-legend-item:hover {
  transform: translateY(-1px);
}

.scenario-legend-item:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Chart container styling */
:deep(.p-chart) {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .h-64 {
    height: 12rem; /* Slightly smaller on mobile */
  }
}
</style>