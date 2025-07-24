<template>
  <div class="mb-8 scenario-grid-view">
    <h2 class="text-2xl font-semibold mb-4">
      Conversion Strategy Comparison
    </h2>
    <p class="text-slate-600 mb-6">
      Compare different Roth conversion amounts and their total tax impact, including taxes saved on <strong>investment growth</strong> during the 10-year distribution period
    </p>

    <!-- Interactive Chart with Disabled Overlay -->
    <div class="relative">
      <ToolsRothConversionBracketCliffChart
        :scenario-calculations="store.filteredScenarios"
        :total-pre-tax-accounts="store.inputs?.totalPreTaxAccounts || 0"
        @scenario-selected="handleChartSelection"
      />
      <!-- Disabled Overlay when in personalization mode without baseline -->
      <div
        v-if="store.personalizationMode && !store.selectedBaseline"
        class="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-lg pointer-events-none"
      />
    </div>

    <!-- Personalization Mode Controls -->
    <ToolsRothConversionPersonalizationModeControls
      :personalization-mode="store.personalizationMode"
      :selected-baseline="store.selectedBaseline"
      :showing-tables="false"
      @enable-personalization="enablePersonalizationMode"
      @disable-personalization="disablePersonalizationMode"
      @change-baseline="changeBaseline"
      @open-personalization-modal="openPersonalizationModal"
    />

    <!-- Scenario Cards Section -->
    <div class="mt-8">
      <div ref="scenarioCardsRef">
        <h3 class="text-lg font-semibold mb-4">
          Strategy Details
        </h3>
        <p class="text-slate-600 mb-4 text-sm">
          Click a chart bar above or select a strategy card below to see detailed analysis
        </p>

        <!-- Standard Mode: All 4 Scenarios -->
        <div v-if="!store.personalizationMode || !store.selectedBaseline" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToolsRothConversionScenarioCard
            v-for="scenario in store.allScenarios"
            :key="scenario.scenario.name"
            :scenario-data="scenario"
            card-type="preset"
            :personalization-mode="store.personalizationMode"
            :is-baseline="false"
            :total-pre-tax-accounts="store.inputs?.totalPreTaxAccounts || 0"
            @card-clicked="selectScenario"
            @baseline-selected="selectBaseline"
          />
        </div>

        <!-- Personalization Mode: Baseline + Custom Scenarios -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <!-- Baseline Scenario Card -->
          <ToolsRothConversionScenarioCard
            :key="store.selectedBaseline.scenario.name"
            :scenario-data="store.selectedBaseline"
            card-type="baseline"
            :personalization-mode="store.personalizationMode"
            :is-baseline="true"
            :total-pre-tax-accounts="store.inputs?.totalPreTaxAccounts || 0"
            @card-clicked="selectScenario"
          />

          <!-- Multiple Custom Scenario Cards -->
          <ToolsRothConversionScenarioCard
            v-for="customScenario in store.customScenarios"
            :key="customScenario.id"
            :scenario-data="customScenario"
            card-type="custom"
            :personalization-mode="store.personalizationMode"
            :is-baseline="false"
            :total-pre-tax-accounts="store.inputs?.totalPreTaxAccounts || 0"
            @card-clicked="selectScenario"
            @edit-clicked="editCustomScenario"
            @delete-clicked="deleteCustomScenario"
          />

          <!-- Dynamic Add Custom Scenario Placeholder -->
          <Card
            v-if="store.customScenarios.length === 0"
            class="custom-placeholder-card border-2 border-dashed border-primary-300 bg-primary-25 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
            @click="openPersonalizationModal"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-primary-700">
                    Create Custom Scenario
                  </h3>
                  <Tag
                    value="Personalized"
                    severity="success"
                    class="text-xs"
                  />
                </div>
                <i class="pi pi-plus-circle text-primary-600 text-xl" />
              </div>
            </template>

            <template #content>
              <div class="space-y-4 text-center py-4">
                <div class="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <i class="pi pi-sliders-h text-primary-600 text-2xl" />
                </div>
                <div>
                  <p class="text-primary-700 font-medium mb-2">
                    Adjust assumptions to see how changes affect your analysis
                  </p>
                  <p class="text-primary-600 text-sm">
                    Personalize tax rates, timeline, and family situation based on your specific circumstances
                  </p>
                </div>
              </div>
            </template>

            <template #footer>
              <div class="text-center">
                <Button
                  severity="primary"
                  size="small"
                  icon="pi pi-cog"
                  label="Personalize This Strategy"
                  class="w-full font-semibold"
                  @click="openPersonalizationModal"
                />
              </div>
            </template>
          </Card>

          <!-- Add Another Custom Scenario Placeholder (1-2 scenarios exist) -->
          <Card
            v-else-if="store.customScenarios.length < 3"
            class="custom-placeholder-card border-2 border-dashed border-primary-300 bg-primary-25 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
            @click="openPersonalizationModal"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-primary-700">
                    {{ store.customScenarios.length === 1 ? 'Add Another Custom Scenario' : 'Add Third Custom Scenario' }}
                  </h3>
                  <Tag
                    :value="`${store.customScenarios.length + 1} of 3`"
                    severity="info"
                    class="text-xs"
                  />
                </div>
                <i class="pi pi-plus-circle text-primary-600 text-xl" />
              </div>
            </template>

            <template #content>
              <div class="space-y-4 text-center py-4">
                <div class="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <i class="pi pi-plus text-primary-600 text-2xl" />
                </div>
                <div>
                  <p class="text-primary-700 font-medium mb-2">
                    Create {{ store.customScenarios.length === 1 ? 'a second' : 'a third' }} custom scenario with different assumptions
                  </p>
                  <p class="text-primary-600 text-sm">
                    Compare multiple personalized scenarios to find the optimal strategy for your situation
                  </p>
                </div>
              </div>
            </template>

            <template #footer>
              <div class="text-center">
                <Button
                  severity="primary"
                  size="small"
                  icon="pi pi-plus"
                  :label="`Add ${store.customScenarios.length === 1 ? 'Second' : 'Third'} Scenario`"
                  class="w-full font-semibold"
                  @click="openPersonalizationModal"
                />
              </div>
            </template>
          </Card>

          <!-- Maximum Scenarios Reached Placeholder (3 scenarios exist) -->
          <Card
            v-else-if="store.customScenarios.length >= 3"
            class="custom-placeholder-card border-2 border-dashed border-slate-300 bg-slate-50 opacity-75"
            :class="{ 'cursor-not-allowed': true }"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-slate-500">
                    Maximum Custom Scenarios
                  </h3>
                  <Tag
                    value="3 of 3"
                    severity="secondary"
                    class="text-xs"
                  />
                </div>
                <i class="pi pi-check-circle text-slate-400 text-xl" />
              </div>
            </template>

            <template #content>
              <div class="space-y-4 text-center py-4">
                <div class="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <i class="pi pi-check text-slate-400 text-2xl" />
                </div>
                <div>
                  <p class="text-slate-500 font-medium mb-2">
                    You've reached the maximum of 3 custom scenarios
                  </p>
                  <p class="text-slate-400 text-sm">
                    Edit or delete existing scenarios to create new ones
                  </p>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- Personalization Modal -->
    <ToolsRothConversionPersonalizationModal
      v-model:visible="store.showPersonalizationModal"
      :baseline-values="store.modalPersonalizationValues"
      @apply-changes="handlePersonalizationApply"
      @cancel="handlePersonalizationCancel"
    />
  </div>
</template>

<script setup>
import { useRothConversionStore } from '~/stores/rothConversionStore'

// Use the comprehensive Roth Conversion store
const store = useRothConversionStore()

// Template refs for smooth scrolling
const scenarioCardsRef = ref(null)

// All actions dispatch to the store
const selectScenario = (scenarioCalculation) => {
  store.selectScenario(scenarioCalculation)
}

const handleChartSelection = (scenarioCalculation) => {
  store.selectScenario(scenarioCalculation)
}

// Personalization actions dispatch to store
const enablePersonalizationMode = () => {
  store.enablePersonalizationMode()
}

const disablePersonalizationMode = () => {
  store.disablePersonalizationMode()
}

const selectBaseline = (scenario) => {
  store.selectBaseline(scenario)
}

const changeBaseline = () => {
  store.changeBaseline()
}

const openPersonalizationModal = () => {
  store.openPersonalizationModal()
}

// Custom scenario CRUD actions dispatch to store
const handlePersonalizationApply = (personalizedValues) => {
  store.addCustomScenario(personalizedValues)
}

const handlePersonalizationCancel = () => {
  store.closePersonalizationModal()
}

const editCustomScenario = (scenarioData) => {
  // Extract ID from the full scenario object
  store.editCustomScenario(scenarioData.id)
}

const deleteCustomScenario = (scenarioData) => {
  // Extract ID from the full scenario object
  store.deleteCustomScenario(scenarioData.id)
}
</script>

<style scoped>
.scenario-card {
  transition: all 0.2s ease;
}

.scenario-card:hover {
  transform: translateY(-1px);
}

.custom-placeholder-card {
  min-height: 300px;
}
</style>
