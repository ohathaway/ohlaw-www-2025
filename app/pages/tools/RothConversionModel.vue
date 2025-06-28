<template>
  <div class="max-w-7xl mx-auto p-6 bg-white">
    <!-- Input Phase -->
    <div v-if="!showResults">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">SECURE 2.0 Impact Calculator</h1>
        <p class="text-gray-600">Calculate the tax impact of retirement account distributions under SECURE 2.0</p>
        <ToolsDisclaimer />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-800">Account Information</h2>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              Total Pre-Tax Retirement Accounts
              <!-- Use the separate InfoIcon component -->
              <LayoutInfoIcon tooltip="Include all traditional IRAs, 401(k)s, SEP-IRAs, and other pre-tax retirement accounts. These will be subject to the 10-year distribution rule under SECURE 2.0, creating forced taxable distributions for your children." />
            </label>
            <InputNumber
              v-model="inputs.totalPreTaxAccounts"
              :min="0"
              mode="currency" currency="USD"
              class="w-full"
              inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              Total Roth Accounts
              <LayoutInfoIcon 
                tooltip="Include all Roth IRAs and Roth 401(k)s. These accounts are tax-free to beneficiaries and provide much more flexibility under SECURE 2.0, though still subject to the 10-year rule."
              />
            </label>
            <InputNumber
              v-model="inputs.totalRothAccounts"
              :min="0"
              mode="currency" currency="USD"
              class="w-full"
              inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              Number of Children (max 4)
              <LayoutInfoIcon 
                tooltip="Non-spouse beneficiaries who will inherit retirement accounts. Under SECURE 2.0, each child must distribute their inherited retirement accounts within 10 years, potentially creating significant tax consequences."
              />
            </label>
            <InputNumber
              v-model="inputs.numberOfChildren"
              :min="1"
              :max="4"
              class="w-full"
              inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            Planning Strategy
            <LayoutInfoIcon 
              tooltip="These inputs model a strategic Roth conversion approach where you convert traditional IRA money to Roth IRAs over time, paying taxes now at current rates rather than forcing your children to pay later at potentially higher rates."
            />
          </h2>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              Roth Conversion Amount
              <LayoutInfoIcon 
                tooltip="Total amount to convert from traditional to Roth IRAs. This reduces the pre-tax inheritance your children receive and increases their tax-free inheritance. Consider your current income and tax bracket capacity."
              />
            </label>
            <InputNumber
              v-model="inputs.conversionAmount"
              :min="0"
              mode="currency" currency="USD"
              class="w-full"
              inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              Conversion Period (Years)
              <LayoutInfoIcon 
                tooltip="Spreading conversions over multiple years helps manage your tax brackets and avoid pushing all conversion income into higher tax rates in a single year."
              />
            </label>
            <InputNumber
              v-model="inputs.conversionYears"
              :min="1"
              class="w-full"
              inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              Current Tax Rate (%)
              <LayoutInfoIcon 
                tooltip="Your effective tax rate on Roth conversions. This is often lower than your children's future marginal rates, especially if you're retired or in lower-income years. Consider both federal and state taxes."
              />
            </label>
            <Select
              v-model="inputs.currentTaxRate"
              :options="taxRateOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select or enter your rate"
              editable
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div v-if="inputs.numberOfChildren" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          Children's Current Marginal Tax Rates (%)
          <LayoutInfoIcon 
            tooltip="Each child's expected marginal tax rate when they receive forced distributions from inherited retirement accounts. Consider their career stage, income level, and the fact that IRA distributions will be stacked on top of their regular income, potentially pushing them into higher brackets."
          />
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in inputs.numberOfChildren" :key="i">
            <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              Child {{ i }} Tax Rate (%)
              <LayoutInfoIcon 
                :tooltip="`This child's marginal tax rate when receiving annual distributions. Remember that the $${Math.round((inputs.totalPreTaxAccounts || 0) / 10 / (inputs.numberOfChildren || 1)).toLocaleString()} annual distribution will be added to their regular income.`"
              />
            </label>
            <Select
              v-model="inputs.childTaxRates[i-1]"
              :options="taxRateOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select or enter this child's rate"
              editable
              class="w-full"
              inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <Button
          @click="calculateResults"
          :disabled="!isFormValid"
          :class="[
            'px-8 py-3 rounded-md font-medium',
            isFormValid
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          Calculate Impact
        </Button>
      </div>
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
            <span class="font-medium">Roth Conversion:</span> {{ formatCurrency(inputs.conversionAmount) }}
          </div>
          <div>
            <span class="font-medium">Conversion Period:</span> {{ inputs.conversionYears }} years
          </div>
          <div>
            <span class="font-medium">Current Tax Rate:</span> {{ inputs.currentTaxRate }}%
          </div>
          
          <div class="pt-2">
            <span class="font-medium">Children's Tax Rates:</span>
            <ul class="mt-1 space-y-1">
              <li v-for="(rate, index) in inputs.childTaxRates.slice(0, inputs.numberOfChildren)" :key="index">
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
// Reactive state
const inputs = reactive({
  totalPreTaxAccounts: 2180000,      // Pre-populated
  totalRothAccounts: null,           // Empty, no placeholder
  numberOfChildren: 4,               // Pre-populated
  conversionAmount: 400000,          // Pre-populated (reasonable default)
  conversionYears: 4,                // Pre-populated
  currentTaxRate: null,              // Empty, no placeholder
  childTaxRates: [null, null, null, null] // Keep placeholders for guidance
})

const taxRateOptions = [
  { label: '10%', value: 10 },
  { label: '12%', value: 12 },
  { label: '22%', value: 22 },
  { label: '24%', value: 24 },
  { label: '32%', value: 32 },
  { label: '35%', value: 35 },
  { label: '37%', value: 37 }
]

const showResults = ref(false)

// Computed properties
const isFormValid = computed(() => {
  const requiredFields = [
    'totalPreTaxAccounts', 'totalRothAccounts', 'numberOfChildren', 
    'conversionAmount', 'conversionYears', 'currentTaxRate'
  ]
  
  const baseValid = requiredFields.every(field => inputs[field] && inputs[field] > 0)
  
  // Check that we have tax rates for the number of children specified
  const numChildren = inputs.numberOfChildren || 0
  const childTaxRatesValid = inputs.childTaxRates
    .slice(0, numChildren)
    .every(rate => rate && rate > 0)

  return baseValid && childTaxRatesValid && numChildren <= 4
})

const calculations = computed(() => {
  if (!isFormValid.value) return null

  const totalPreTax = inputs.totalPreTaxAccounts
  const totalRoth = inputs.totalRothAccounts
  const numChildren = inputs.numberOfChildren
  const conversionAmount = inputs.conversionAmount
  const currentTaxRate = inputs.currentTaxRate / 100

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
    const childTaxRate = inputs.childTaxRates[i] / 100
    
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
const basicInfoData = computed(() => [
  {
    scenario: 'Current Pre-Tax Accounts',
    doNothing: formatCurrency(inputs.totalPreTaxAccounts),
    strategic: formatCurrency(inputs.totalPreTaxAccounts)
  },
  {
    scenario: 'Strategy',
    doNothing: 'Current beneficiary designations\n"Spouse, then kids"',
    strategic: 'Coordinated Roth conversions\n+ Optimized beneficiaries'
  },
  {
    scenario: 'Tax Timing',
    doNothing: 'Children forced to withdraw\nover 10 years at peak earnings',
    strategic: 'Parents control timing\nat current tax rates'
  }
])

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

const calculateResults = () => {
  showResults.value = true
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