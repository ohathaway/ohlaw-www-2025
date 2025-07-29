<template>
  <div v-if="store.selectedScenario && store.inputs" class="scenario-details-view">
    <!-- Disabled Overlay when in personalization mode without baseline -->
    <div
      v-if="store.personalizationMode && !store.selectedBaseline"
      class="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-lg pointer-events-none z-10"
    />

    <!-- Assumptions Card with Back Button -->
    <Card class="mb-6 bg-primary-50 border border-primary-200">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-primary-800">
              Selected Strategy: {{ store.selectedScenario.scenario.name }}
            </h3>
            <Tag
              v-if="store.selectedScenario.isCustom"
              value="Custom"
              severity="success"
              class="text-xs"
            />
          </div>
          <Button
            severity="secondary"
            size="small"
            icon="pi pi-arrow-left"
            label="Back to Scenarios"
            class="text-sm"
            @click="backToScenarios"
          />
        </div>
      </template>

      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 text-sm">
          <div class="flex justify-between">
            <span class="font-medium text-primary-700">Pre-Tax Accounts:</span>
            <span>{{ formatCurrency(store.inputs.totalPreTaxAccounts) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-primary-700">Roth Accounts:</span>
            <span>{{ formatCurrency(store.inputs.totalRothAccounts) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-primary-700">Number of Children:</span>
            <span>{{ store.inputs.numberOfChildren }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-primary-700">Roth Conversion:</span>
            <span>{{ formatCurrency(store.selectedScenario.scenario.conversionAmount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-primary-700">Parent Tax Rate:</span>
            <span>{{ store.selectedScenario.scenario.parentTaxRate }}%</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-primary-700">Net Family Savings:</span>
            <span class="font-semibold" :class="store.selectedScenario.netFamilySavings > 0 ? 'text-success-600' : 'text-danger-600'">
              {{ store.selectedScenario.netFamilySavings > 0 ? '+' : '' }}{{ formatCurrency(store.selectedScenario.netFamilySavings) }}
            </span>
          </div>

          <!-- Additional custom scenario fields -->
          <div v-if="store.selectedScenario.isCustom" class="flex justify-between">
            <span class="font-medium text-primary-700">Conversion Timeline:</span>
            <span>{{ store.selectedScenario.scenario.conversionYears }} {{ store.selectedScenario.scenario.conversionYears === 1 ? 'year' : 'years' }}</span>
          </div>
          <div v-if="store.selectedScenario.isCustom" class="flex justify-between">
            <span class="font-medium text-primary-700">Return Rate:</span>
            <span>{{ store.selectedScenario.scenario.returnRate }}% annually</span>
          </div>
          <div v-if="store.selectedScenario.isCustom" class="flex justify-between">
            <span class="font-medium text-primary-700">Planning Timeline:</span>
            <span>{{ store.selectedScenario.scenario.yearsUntilInheritance }} {{ store.selectedScenario.scenario.yearsUntilInheritance === 1 ? 'year' : 'years' }} until inheritance</span>
          </div>
        </div>

        <div class="mt-4 pt-2 border-t border-primary-200">
          <span class="font-medium text-primary-700">Children's Tax Rates:</span>
          <div class="mt-1 flex flex-wrap gap-2">
            <Tag
              v-for="(rate, index) in store.selectedScenario.scenario.childTaxRates.slice(0, store.inputs.numberOfChildren)"
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
        severity="secondary"
        size="large"
        icon="pi pi-arrow-left"
        label="Back to Scenarios"
        class="shadow-lg border-2 border-primary-300 bg-white hover:bg-primary-50"
        @click="backToScenarios"
      />
    </div>

    <!-- Detailed Analysis Tables -->
    <div class="space-y-8">
      <!-- Basic Info Table -->
      <div class="overflow-x-auto">
        <DataTable :value="store.basicInfoData" class="w-full">
          <Column field="scenario" header="SCENARIO" class="font-semibold" />
          <Column field="doNothing" header="DO NOTHING" class="font-semibold" />
          <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold" />
        </DataTable>
      </div>

      <!-- Inheritance Table -->
      <div class="overflow-x-auto">
        <h4 class="text-xl font-semibold mb-4">
          INHERITANCE PER CHILD
        </h4>
        <DataTable :value="store.inheritanceData" class="w-full">
          <Column field="type" header="INHERITANCE PER CHILD" class="font-semibold" />
          <Column field="doNothing" header="DO NOTHING" class="font-semibold" />
          <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold" />
        </DataTable>
      </div>

      <!-- Tax Impact Table -->
      <div class="overflow-x-auto">
        <h4 class="text-xl font-semibold mb-4">
          10-YEAR TAX IMPACT
        </h4>
        <DataTable :value="store.taxImpactData" class="w-full">
          <Column field="child" header="TAX BURDEN" class="font-semibold" />
          <Column field="doNothing" header="DO NOTHING" class="font-semibold" />
          <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold" />
        </DataTable>
      </div>

      <!-- Bottom Line Table -->
      <div class="overflow-x-auto">
        <h4 class="text-xl font-semibold mb-4">
          THE BOTTOM LINE
        </h4>
        <DataTable :value="store.bottomLineData" class="w-full">
          <Column field="impact" header="TOTAL FAMILY IMPACT" class="font-semibold" />
          <Column field="doNothing" header="DO NOTHING" class="font-semibold" />
          <Column field="strategic" header="STRATEGIC PLANNING" class="font-semibold" />
        </DataTable>
      </div>

      <!-- Bottom Navigation -->
      <div class="mt-12 pt-6 border-t border-slate-200 text-center">
        <Button
          severity="primary"
          size="large"
          icon="pi pi-arrow-left"
          label="Back to All Scenarios"
          class="px-8 py-3"
          @click="backToScenarios"
        />
        <p class="text-slate-600 text-sm mt-3">
          Compare with other conversion strategies or adjust your assumptions
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRothConversionStore } from '~/stores/rothConversionStore'
import { formatCurrency } from '~/utils/numbers'

// Use the comprehensive Roth Conversion store
const store = useRothConversionStore()

const backToScenarios = () => {
  store.backToScenarios()
}
</script>

<style scoped>
/* Component-specific styles */
</style>
