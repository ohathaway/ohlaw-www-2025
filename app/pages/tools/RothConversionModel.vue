<template>
  <div class="max-w-7xl mx-auto p-6 bg-white">
    <!-- Input Phase -->
    <div v-if="!showResults">
      <ToolsRothConversionInputForm @generate-analysis="handleGenerateAnalysis" />
    </div>

    <!-- Results Phase -->
    <div v-else class="flex gap-6">
      <!-- Sidebar -->
      <div class="w-80 bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Assumptions</h3>
        
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

        <Button
          @click="editAssumptions"
          class="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Edit Assumptions
        </Button>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">SECURE 2.0 Impact Analysis</h1>
        <p class="text-gray-600 mb-8">Side-by-Side Comparison of Tax Strategies</p>
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
          <h2 class="text-xl font-semibold text-gray-800 mb-4">INHERITANCE PER CHILD</h2>
          <DataTable :value="inheritanceData" class="w-full">
            <Column field="type" header="INHERITANCE PER CHILD" class="font-semibold"></Column>
            <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
            <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
          </DataTable>
        </div>

        <!-- Tax Impact Table -->
        <div class="mb-8 overflow-x-auto">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">10-YEAR TAX IMPACT</h2>
          <DataTable :value="taxImpactData" class="w-full">
            <Column field="child" header="TAX BURDEN" class="font-semibold"></Column>
            <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
            <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
          </DataTable>
        </div>

        <!-- Bottom Line Table -->
        <div class="overflow-x-auto">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">THE BOTTOM LINE</h2>
          <DataTable :value="bottomLineData" class="w-full">
            <Column field="impact" header="TOTAL FAMILY IMPACT" class="font-semibold"></Column>
            <Column field="doNothing" header="DO NOTHING" class="font-semibold"></Column>
            <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold"></Column>
          </DataTable>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// Data from input form and scenarios
const inputs = ref(null)
const scenarios = ref([])
const selectedScenario = ref(null)
const showResults = ref(false)

// Handle form submission from InputForm component
const handleGenerateAnalysis = (data) => {
  inputs.value = data.inputs
  scenarios.value = data.scenarios
  selectedScenario.value = data.scenarios[1] // Default to "Moderate" scenario
  showResults.value = true
}

const calculations = computed(() => {
  if (!inputs.value || !selectedScenario.value) return null

  const totalPreTax = inputs.value.totalPreTaxAccounts
  const totalRoth = inputs.value.totalRothAccounts
  const numChildren = inputs.value.numberOfChildren
  const conversionAmount = selectedScenario.value.conversionAmount
  const currentTaxRate = selectedScenario.value.parentTaxRate / 100

  // Do Nothing Scenario
  const preTaxPerChild = totalPreTax / numChildren
  const rothPerChild = totalRoth / numChildren
  const annualDistributionPerChild = preTaxPerChild / 10

  // Strategic Planning Scenario
  const newPreTaxPerChild = (totalPreTax - conversionAmount) / numChildren
  const newRothPerChild = (totalRoth + conversionAmount) / numChildren
  const newAnnualDistributionPerChild = newPreTaxPerChild / 10
  const newAnnualRothPerChild = newRothPerChild / 10

  // Tax calculations
  const parentConversionTax = conversionAmount * currentTaxRate

  const childrenDoNothing = []
  const childrenStrategic = []
  let totalDoNothingTax = 0
  let totalStrategicTax = 0

  for (let i = 0; i < numChildren; i++) {
    const childTaxRate = selectedScenario.value.childTaxRates[i] / 100
    
    const doNothingAnnualTax = annualDistributionPerChild * childTaxRate
    const doNothing10YearTax = doNothingAnnualTax * 10
    
    const strategicAnnualTax = newAnnualDistributionPerChild * childTaxRate
    const strategic10YearTax = strategicAnnualTax * 10
    
    childrenDoNothing.push({
      annualDistribution: annualDistributionPerChild,
      annualTax: doNothingAnnualTax,
      totalTax: doNothing10YearTax,
      taxRate: childTaxRate
    })
    
    childrenStrategic.push({
      annualTaxableDistribution: newAnnualDistributionPerChild,
      annualTaxFreeDistribution: newAnnualRothPerChild,
      annualTax: strategicAnnualTax,
      totalTax: strategic10YearTax,
      taxRate: childTaxRate
    })
    
    totalDoNothingTax += doNothing10YearTax
    totalStrategicTax += strategic10YearTax
  }

  const totalFamilyTaxDoNothing = totalDoNothingTax
  const totalFamilyTaxStrategic = parentConversionTax + totalStrategicTax
  const netFamilySavings = totalFamilyTaxDoNothing - totalFamilyTaxStrategic

  return {
    doNothing: {
      preTaxPerChild,
      rothPerChild,
      annualDistributionPerChild,
      children: childrenDoNothing,
      totalFamilyTax: totalFamilyTaxDoNothing
    },
    strategic: {
      preTaxPerChild: newPreTaxPerChild,
      rothPerChild: newRothPerChild,
      annualDistributionPerChild: newAnnualDistributionPerChild,
      annualRothPerChild: newAnnualRothPerChild,
      children: childrenStrategic,
      parentConversionTax,
      totalChildrenTax: totalStrategicTax,
      totalFamilyTax: totalFamilyTaxStrategic
    },
    netFamilySavings
  }
})

// Table data computed properties
const basicInfoData = computed(() => {
  if (!inputs.value) return []
  
  return [
    {
      scenario: 'Current Pre-Tax Accounts',
      doNothing: formatCurrency(inputs.value.totalPreTaxAccounts),
      strategic: formatCurrency(inputs.value.totalPreTaxAccounts)
    },
    {
      scenario: 'Strategy',
      doNothing: 'Current beneficiary designations\n"Spouse, then kids"',
      strategic: `${selectedScenario.value?.name || 'Strategic'} Roth conversions\n+ Optimized beneficiaries`
    },
    {
      scenario: 'Tax Timing',
      doNothing: 'Children forced to withdraw\nover 10 years at peak earnings',
      strategic: 'Parents control timing\nat current tax rates'
    }
  ]
})

const inheritanceData = computed(() => {
  if (!calculations.value) return []
  
  return [
    {
      type: 'Traditional IRA',
      doNothing: formatCurrency(calculations.value.doNothing.preTaxPerChild),
      strategic: formatCurrency(calculations.value.strategic.preTaxPerChild)
    },
    {
      type: 'Roth IRA',
      doNothing: formatCurrency(calculations.value.doNothing.rothPerChild),
      strategic: formatCurrency(calculations.value.strategic.rothPerChild)
    },
    {
      type: 'Annual Required Distribution',
      doNothing: `${formatCurrency(calculations.value.doNothing.annualDistributionPerChild)} (taxable)`,
      strategic: `${formatCurrency(calculations.value.strategic.annualDistributionPerChild)} (taxable)\n${formatCurrency(calculations.value.strategic.annualRothPerChild)} (tax-free)`
    }
  ]
})

const taxImpactData = computed(() => {
  if (!calculations.value) return []
  
  return calculations.value.doNothing.children.map((child, index) => ({
    child: `Child ${index + 1}`,
    doNothing: `${formatCurrency(child.annualDistribution)} × ${formatPercent(child.taxRate)} = ${formatCurrency(child.annualTax)}/year\nTotal: ${formatCurrency(child.totalTax)}`,
    strategic: `${formatCurrency(calculations.value.strategic.children[index].annualTaxableDistribution)} × ${formatPercent(calculations.value.strategic.children[index].taxRate)} = ${formatCurrency(calculations.value.strategic.children[index].annualTax)}/year\nTotal: ${formatCurrency(calculations.value.strategic.children[index].totalTax)}`
  }))
})

const bottomLineData = computed(() => {
  if (!calculations.value) return []
  
  return [
    {
      impact: 'Parents Pay During Life',
      doNothing: formatCurrency(0),
      strategic: formatCurrency(calculations.value.strategic.parentConversionTax)
    },
    {
      impact: 'Children Pay Over 10 Years',
      doNothing: formatCurrency(calculations.value.doNothing.totalFamilyTax),
      strategic: formatCurrency(calculations.value.strategic.totalChildrenTax)
    },
    {
      impact: 'TOTAL FAMILY TAX BURDEN',
      doNothing: formatCurrency(calculations.value.doNothing.totalFamilyTax),
      strategic: formatCurrency(calculations.value.strategic.totalFamilyTax)
    },
    {
      impact: 'NET FAMILY SAVINGS',
      doNothing: '—',
      strategic: `+${formatCurrency(calculations.value.netFamilySavings)}`
    }
  ]
})

// Methods
const formatCurrency = (amount) => {
  if (!amount) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatPercent = (rate) => {
  return `${(rate * 100).toFixed(1)}%`
}

const editAssumptions = () => {
  showResults.value = false
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