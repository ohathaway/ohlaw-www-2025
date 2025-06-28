<template>
  <div class="max-w-7xl mx-auto p-6 bg-white">
    <!-- Input Phase -->
    <div v-if="!showResults">
      <ToolsRothConversionInputForm @generate-analysis="handleGenerateAnalysis" />
    </div>

    <!-- Scenario Comparison Phase -->
    <div v-else-if="showScenarios && !showDetailedResults">
      <ToolsRothConversionScenarioComparison 
        :inputs="inputs"
        :selected-calculation="selectedCalculation"
        @scenario-selected="handleScenarioSelection"
      />
    </div>

    <!-- Results Phase -->
    <div v-else-if="showDetailedResults" class="flex gap-6">
      <!-- Sidebar -->
      <div class="w-80 bg-slate-50 p-6 rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Assumptions</h3>
        
        <div class="space-y-3 text-sm">
          <div>
            <span class="font-medium">Pre-Tax Accounts:</span> {{ formatCurrency(inputs.totalPreTaxAccounts) }}
          </div>
          <div>
            <span class="font-medium">Roth Accounts:</span> {{ formatCurrency(inputs.totalRothAccounts) }}
          </div>
          <div>
            <span class="font-medium">Number of Children:</span> {{ inputs.numberOfChildren }}
          </div>
          <div>
            <span class="font-medium">Scenario:</span> {{ selectedScenario?.name || 'Moderate' }}
          </div>
          <div>
            <span class="font-medium">Roth Conversion:</span> {{ formatCurrency(selectedScenario?.conversionAmount) }}
          </div>
          <div>
            <span class="font-medium">Parent Tax Rate:</span> {{ selectedScenario?.parentTaxRate }}%
          </div>
          
          <div class="pt-2">
            <span class="font-medium">Children's Tax Rates:</span>
            <ul class="mt-1 space-y-1">
              <li v-for="(rate, index) in selectedScenario?.childTaxRates?.slice(0, inputs.numberOfChildren)" :key="index">
                Child {{ index + 1 }}: {{ rate }}%
              </li>
            </ul>
          </div>
        </div>

        <div class="space-y-3">
          <Button
            @click="backToScenarios"
            class="w-full px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            ← Back to Scenarios
          </Button>
          <Button
            @click="editAssumptions"
            class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Edit Assumptions
          </Button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold mb-2">SECURE 2.0 Impact Analysis</h1>
        <p class="text-slate-600 mb-8">Side-by-Side Comparison of Tax Strategies</p>
        <ToolsDisclaimer />

        <!-- Basic Info Table -->
        <div class="mb-8 overflow-x-auto">
          <DataTable :value="basicInfoData" class="w-full">
            <Column field="scenario" header="SCENARIO" class="font-semibold"></Column>
            <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
            <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
          </DataTable>
        </div>

        <!-- Inheritance Table -->
        <div class="mb-8 overflow-x-auto">
          <h2 class="text-xl font-semibold mb-4">INHERITANCE PER CHILD</h2>
          <DataTable :value="inheritanceData" class="w-full">
            <Column field="type" header="INHERITANCE PER CHILD" class="font-semibold"></Column>
            <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
            <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
          </DataTable>
        </div>

        <!-- Tax Impact Table -->
        <div class="mb-8 overflow-x-auto">
          <h2 class="text-xl font-semibold mb-4">10-YEAR TAX IMPACT</h2>
          <DataTable :value="taxImpactData" class="w-full">
            <Column field="child" header="TAX BURDEN" class="font-semibold"></Column>
            <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
            <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
          </DataTable>
        </div>

        <!-- Bottom Line Table -->
        <div class="overflow-x-auto">
          <h2 class="text-xl font-semibold mb-4">THE BOTTOM LINE</h2>
          <DataTable :value="bottomLineData" class="w-full">
            <Column field="impact" header="TOTAL FAMILY IMPACT" class="font-semibold"></Column>
            <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
            <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
          </DataTable>
        </div>

      </div>
    </div>

    <!-- Debug: Fallback case -->
    <div v-else class="p-4 bg-warning-100 border border-warning-400 rounded-md">
      <p class="text-warning-700">
        DEBUG: No template condition matched!<br>
        showResults: {{ showResults }}<br>
        showScenarios: {{ showScenarios }}<br>
        showDetailedResults: {{ showDetailedResults }}<br>
        inputs: {{ inputs }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRothCalculations } from '~/composables/useRothCalculations'
import { formatCurrency, formatPercent } from '~/utils/numbers'

// Use the Roth calculations composable
const { calculateScenario, formatTableData } = useRothCalculations()

// Data from input form and scenarios
const inputs = ref(null)
const selectedScenario = ref(null)
const selectedCalculation = ref(null)
const showResults = ref(false)
const showScenarios = ref(false)
const showDetailedResults = ref(false)

// Handle form submission from InputForm component
const handleGenerateAnalysis = (data) => {
  inputs.value = data.inputs
  showResults.value = true
  showScenarios.value = true
  showDetailedResults.value = false
}

// Handle scenario selection from ScenarioComparison component
const handleScenarioSelection = (scenarioCalculation) => {
  selectedScenario.value = scenarioCalculation.scenario
  selectedCalculation.value = scenarioCalculation
  // Keep showing scenarios view - don't switch to detailed results
  // The ScenarioComparison component will handle showing tables internally
}

// Use the calculation from the selected scenario
const calculations = computed(() => {
  return selectedCalculation.value
})

// Table data computed properties using the composable
const tableData = computed(() => {
  if (!calculations.value || !inputs.value) return {}
  return formatTableData(calculations.value, inputs.value)
})

const basicInfoData = computed(() => tableData.value.basicInfoData || [])
const inheritanceData = computed(() => tableData.value.inheritanceData || [])
const taxImpactData = computed(() => tableData.value.taxImpactData || [])
const bottomLineData = computed(() => tableData.value.bottomLineData || [])

// Methods
const backToScenarios = () => {
  showScenarios.value = true
  showDetailedResults.value = false
}

const editAssumptions = () => {
  showResults.value = false
  showScenarios.value = false
  showDetailedResults.value = false
}
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