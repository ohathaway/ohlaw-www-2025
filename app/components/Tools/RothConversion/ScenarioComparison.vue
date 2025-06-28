<template>
  <div class="mb-8 scenario-comparison-container">
    <h2 class="text-2xl font-semibold mb-4">Conversion Strategy Comparison</h2>
    <p class="text-slate-600 mb-6">Compare different Roth conversion amounts and their total tax impact, including taxes saved on <strong>investment growth</strong> during the 10-year distribution period</p>
    
    <!-- Interactive Chart -->
    <ToolsRothConversionBracketCliffChart 
      :scenario-calculations="scenarioCalculations"
      @scenario-selected="handleChartSelection"
    />
    
    <!-- Scenario Cards OR Detailed Tables -->
    <div class="mt-8">
      <!-- Scenario Cards View -->
      <div v-if="!showingTables" id="scenario-cards" class="scroll-mt-4">
        <h3 class="text-lg font-semibold mb-4">Strategy Details</h3>
        <p class="text-slate-600 mb-4 text-sm">Click a chart bar above or select a strategy card below to see detailed analysis</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            v-for="scenario in scenarioCalculations"
            :key="scenario.scenario.name"
            class="scenario-card cursor-pointer transition-all duration-200 hover:shadow-md"
            :class="getScenarioClasses(scenario.scenario)"
            @click="selectScenario(scenario)"
            role="button"
            :aria-label="`Select ${scenario.scenario.name} conversion strategy`"
            tabindex="0"
            @keydown.enter="selectScenario(scenario)"
            @keydown.space.prevent="selectScenario(scenario)"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold">{{ scenario.scenario.name }}</h3>
                  <Tag
                    v-if="scenario.scenario.isSweetSpot"
                    severity="success"
                    value="Sweet Spot"
                    class="text-xs"
                  />
                </div>
                <i :class="getScenarioIcon(scenario.scenario)" class="text-xl"></i>
              </div>
            </template>
            
            <template #content>
              <div class="space-y-3">
                <!-- Conversion Amount -->
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-slate-600">Conversion Amount:</span>
                  <span class="font-semibold">{{ formatCurrency(scenario.scenario.conversionAmount) }}</span>
                </div>
                
                <!-- Parent Tax Rate -->
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-slate-600">Parent Tax Rate:</span>
                  <span class="font-semibold">{{ scenario.scenario.parentTaxRate }}%</span>
                </div>
                
                <!-- Net Family Savings -->
                <div class="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span class="text-sm font-medium text-slate-600">Net Family Savings:</span>
                  <span 
                    class="font-bold text-lg"
                    :class="scenario.netFamilySavings > 0 ? 'text-success-700' : 'text-danger-700'"
                  >
                    {{ scenario.netFamilySavings > 0 ? '+' : '' }}{{ formatCurrency(scenario.netFamilySavings) }}
                  </span>
                </div>
                
                <!-- Warning for Danger Zone -->
                <div 
                  v-if="scenario.scenario.isDangerous && scenario.netFamilySavings < 0"
                  class="flex items-center gap-2 p-3 bg-danger-100 border border-danger-300 rounded-md mt-3"
                >
                  <i class="pi pi-exclamation-triangle text-danger-600"></i>
                  <span class="text-sm font-semibold text-danger-700">
                    ⚠️ Family loses money with this strategy
                  </span>
                </div>
                
                <!-- Success indicator for positive savings -->
                <div 
                  v-else-if="scenario.netFamilySavings > 0"
                  class="flex items-center gap-2 p-2 bg-success-50 border border-success-200 rounded-md mt-3"
                >
                  <i class="pi pi-check text-success-600"></i>
                  <span class="text-sm font-medium text-success-700">
                    Tax savings for your family
                  </span>
                </div>
              </div>
            </template>
            
            <template #footer>
              <div class="text-center">
                <Button
                  :severity="getButtonSeverity(scenario.scenario)"
                  size="small"
                  :label="`Select ${scenario.scenario.name}`"
                  @click.stop="selectScenario(scenario)"
                  class="w-full"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Detailed Tables View -->
      <div v-else-if="selectedScenario && props.selectedCalculation">
        <!-- Assumptions Card with Back Button -->
        <Card class="mb-6 bg-primary-50 border border-primary-200">
          <template #title>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-primary-800">Selected Strategy: {{ selectedScenario.scenario.name }}</h3>
              <Button
                @click="backToScenarios"
                severity="secondary"
                size="small"
                icon="pi pi-arrow-left"
                label="Back to Scenarios"
                class="text-sm"
              />
            </div>
          </template>
          
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 text-sm">
              <div class="flex justify-between">
                <span class="font-medium text-primary-700">Pre-Tax Accounts:</span>
                <span>{{ formatCurrency(inputs.totalPreTaxAccounts) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-primary-700">Roth Accounts:</span>
                <span>{{ formatCurrency(inputs.totalRothAccounts) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-primary-700">Number of Children:</span>
                <span>{{ inputs.numberOfChildren }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-primary-700">Roth Conversion:</span>
                <span>{{ formatCurrency(selectedScenario.scenario.conversionAmount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-primary-700">Parent Tax Rate:</span>
                <span>{{ selectedScenario.scenario.parentTaxRate }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-primary-700">Net Family Savings:</span>
                <span class="font-semibold" :class="props.selectedCalculation.netFamilySavings > 0 ? 'text-success-600' : 'text-danger-600'">
                  {{ props.selectedCalculation.netFamilySavings > 0 ? '+' : '' }}{{ formatCurrency(props.selectedCalculation.netFamilySavings) }}
                </span>
              </div>
            </div>

            <div class="mt-4 pt-2 border-t border-primary-200">
              <span class="font-medium text-primary-700">Children's Tax Rates:</span>
              <div class="mt-1 flex flex-wrap gap-2">
                <Tag
                  v-for="(rate, index) in selectedScenario.scenario.childTaxRates.slice(0, inputs.numberOfChildren)"
                  :key="index"
                  :value="`Child ${index + 1}: ${rate}%`"
                  severity="info"
                  class="text-xs"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Floating Back Button -->
        <div class="fixed bottom-6 right-6 z-50">
          <Button
            @click="backToScenarios"
            severity="secondary"
            size="large"
            icon="pi pi-arrow-left"
            label="Back to Scenarios"
            class="shadow-lg border-2 border-primary-300 bg-white hover:bg-primary-50"
          />
        </div>

        <!-- Detailed Analysis Tables -->
        <div class="space-y-8">
          <!-- Basic Info Table -->
          <div class="overflow-x-auto">
            <DataTable :value="basicInfoData" class="w-full">
              <Column field="scenario" header="SCENARIO" class="font-semibold"></Column>
              <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
              <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
            </DataTable>
          </div>

          <!-- Inheritance Table -->
          <div class="overflow-x-auto">
            <h4 class="text-xl font-semibold mb-4">INHERITANCE PER CHILD</h4>
            <DataTable :value="inheritanceData" class="w-full">
              <Column field="type" header="INHERITANCE PER CHILD" class="font-semibold"></Column>
              <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
              <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
            </DataTable>
          </div>

          <!-- Tax Impact Table -->
          <div class="overflow-x-auto">
            <h4 class="text-xl font-semibold mb-4">10-YEAR TAX IMPACT</h4>
            <DataTable :value="taxImpactData" class="w-full">
              <Column field="child" header="TAX BURDEN" class="font-semibold"></Column>
              <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
              <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
            </DataTable>
          </div>

          <!-- Bottom Line Table -->
          <div class="overflow-x-auto">
            <h4 class="text-xl font-semibold mb-4">THE BOTTOM LINE</h4>
            <DataTable :value="bottomLineData" class="w-full">
              <Column field="impact" header="TOTAL FAMILY IMPACT" class="font-semibold"></Column>
              <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
              <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
            </DataTable>
          </div>

          <!-- Bottom Navigation -->
          <div class="mt-12 pt-6 border-t border-slate-200 text-center">
            <Button
              @click="backToScenarios"
              severity="primary"
              size="large"
              icon="pi pi-arrow-left"
              label="Back to All Scenarios"
              class="px-8 py-3"
            />
            <p class="text-slate-600 text-sm mt-3">
              Compare with other conversion strategies or adjust your assumptions
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRothCalculations } from '~/composables/useRothCalculations'
import { formatCurrency } from '~/utils/numbers'

const props = defineProps({
  inputs: {
    type: Object,
    required: true
  },
  selectedCalculation: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['scenario-selected'])

// Use the Roth calculations composable
const { 
  calculateAllScenarios, 
  getScenarioClasses, 
  getScenarioIcon,
  formatTableData 
} = useRothCalculations()

// VueUse scroll composable
// const { scrollIntoView } = useScrollIntoView()

// Calculate all scenarios
const scenarioCalculations = computed(() => {
  return calculateAllScenarios(props.inputs)
})

// Track selected scenario
const selectedScenario = ref(null)
const showingTables = ref(false)

// Table data computed properties
const tableData = computed(() => {
  if (!props.selectedCalculation || !props.inputs) return {}
  return formatTableData(props.selectedCalculation, props.inputs)
})

const basicInfoData = computed(() => tableData.value.basicInfoData || [])
const inheritanceData = computed(() => tableData.value.inheritanceData || [])
const taxImpactData = computed(() => tableData.value.taxImpactData || [])
const bottomLineData = computed(() => tableData.value.bottomLineData || [])

/**
 * Handle scenario selection from either chart or cards
 * @param {Object} scenarioCalculation - Selected scenario calculation
 */
const selectScenario = (scenarioCalculation) => {
  selectedScenario.value = scenarioCalculation
  showingTables.value = true
  emit('scenario-selected', scenarioCalculation)
}

/**
 * Handle chart selection (chart component emits scenario-selected)
 * @param {Object} scenarioCalculation - Selected scenario from chart
 */
const handleChartSelection = (scenarioCalculation) => {
  selectScenario(scenarioCalculation)
}

/**
 * Go back to scenario cards view
 */
const backToScenarios = () => {
  selectedScenario.value = null
  showingTables.value = false
  
  // Scroll scenario cards into view using VueUse
/*
  nextTick(() => {
    const element = document.querySelector('#scenario-cards')
    if (element) {
      scrollIntoView(element, {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  })
*/
}

/**
 * Get button severity based on scenario theme
 * @param {Object} scenario - Scenario object
 * @returns {string} PrimeVue button severity
 */
const getButtonSeverity = (scenario) => {
  if (!scenario || !scenario.colorTheme) return 'secondary'
  
  const severityMap = {
    success: 'success',
    info: 'info', 
    warning: 'warn',
    danger: 'danger'
  }
  
  return severityMap[scenario.colorTheme] || 'secondary'
}

// Watch for changes in selectedCalculation prop to sync local state
watch(() => props.selectedCalculation, (newCalculation) => {
  if (newCalculation) {
    selectedScenario.value = newCalculation
    showingTables.value = true
  } else {
    selectedScenario.value = null
    showingTables.value = false
  }
}, { immediate: true })
</script>

<style scoped>
.scenario-card {
  transition: all 0.2s ease;
}

.scenario-card:hover {
  transform: translateY(-1px);
}

.scenario-card:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Enhance semantic color borders */
:deep(.bg-success-50) {
  border-color: rgb(var(--success-200));
}

:deep(.bg-info-50) {
  border-color: rgb(var(--info-200));
}

:deep(.bg-warning-50) {
  border-color: rgb(var(--warning-200));
}

:deep(.bg-danger-50) {
  border-color: rgb(var(--danger-200));
}
</style>