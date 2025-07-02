<template>
  <div class="mb-8 scenario-comparison-container">
    <h2 class="text-2xl font-semibold mb-4">Conversion Strategy Comparison</h2>
    <p class="text-slate-600 mb-6">Compare different Roth conversion amounts and their total tax impact, including taxes saved on <strong>investment growth</strong> during the 10-year distribution period</p>
    
    <!-- Interactive Chart with Disabled Overlay -->
    <div class="relative">
      <ToolsRothConversionBracketCliffChart 
        :scenario-calculations="filteredScenarios"
        @scenario-selected="handleChartSelection"
      />
      <!-- Disabled Overlay when in personalization mode without baseline -->
      <div 
        v-if="personalizationMode && !selectedBaseline" 
        class="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-lg pointer-events-none"
      ></div>
    </div>
    
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
                @click="enablePersonalizationMode"
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
                @click="disablePersonalizationMode"
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
            @click="openPersonalizationModal"
            severity="primary"
            icon="pi pi-sliders-h"
            label="Personalize"
            size="small"
          />
          <Button
            @click="changeBaseline"
            severity="secondary"
            icon="pi pi-refresh"
            label="Change Baseline"
            size="small"
          />
          <Button
            @click="disablePersonalizationMode"
            severity="secondary"
            icon="pi pi-arrow-left"
            label="Back to Standard View"
            size="small"
          />
        </div>
      </div>
    </div>
    
    <!-- Scenario Cards OR Detailed Tables -->
    <div class="mt-8">
      <!-- Scenario Cards View -->
      <div v-if="!showingTables" ref="scenarioCardsRef" id="scenario-cards" class="scroll-mt-4">
        <h3 class="text-lg font-semibold mb-4">Strategy Details</h3>
        <p class="text-slate-600 mb-4 text-sm">Click a chart bar above or select a strategy card below to see detailed analysis</p>
        
        <!-- Standard Mode: All 4 Scenarios -->
        <div v-if="!personalizationMode || !selectedBaseline" class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div class="space-y-2">
                <!-- Main Selection Button (disabled in personalization mode) -->
                <div v-if="!personalizationMode" class="text-center">
                  <Button
                    :severity="getButtonSeverity(scenario.scenario)"
                    size="small"
                    :label="`Show ${scenario.scenario.name} Details`"
                    @click.stop="selectScenario(scenario)"
                    class="w-full"
                  />
                </div>
                
                <!-- Baseline Selection (only in personalization mode) -->
                <div v-if="personalizationMode" class="text-center">
                  <!-- Show baseline button if not selected or different baseline -->
                  <Button
                    v-if="!selectedBaseline || selectedBaseline.scenario.name !== scenario.scenario.name"
                    @click.stop="selectBaseline(scenario)"
                    severity="secondary"
                    size="small"
                    icon="pi pi-bookmark"
                    label="Select as Baseline"
                    class="w-full"
                  />
                  
                  <!-- Show baseline indicator if this is the selected baseline -->
                  <Tag
                    v-else
                    value="Your Baseline"
                    severity="info"
                    icon="pi pi-bookmark-fill"
                    class="w-full justify-center text-sm font-semibold px-3 py-2"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Personalization Mode: Baseline + Custom Scenarios -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <!-- Baseline Scenario Card -->
          <Card
            :key="selectedBaseline.scenario.name"
            class="scenario-card cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-info-300"
            :class="getScenarioClasses(selectedBaseline.scenario)"
            @click="selectScenario(selectedBaseline)"
            role="button"
            :aria-label="`Select ${selectedBaseline.scenario.name} conversion strategy`"
            tabindex="0"
            @keydown.enter="selectScenario(selectedBaseline)"
            @keydown.space.prevent="selectScenario(selectedBaseline)"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold">{{ selectedBaseline.scenario.name }}</h3>
                  <Tag
                    value="Your Baseline"
                    severity="info"
                    class="text-xs"
                  />
                </div>
                <i :class="getScenarioIcon(selectedBaseline.scenario)" class="text-xl"></i>
              </div>
            </template>
            
            <template #content>
              <div class="space-y-3">
                <!-- Conversion Amount -->
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-slate-600">Conversion Amount:</span>
                  <span class="font-semibold">{{ formatCurrency(selectedBaseline.scenario.conversionAmount) }}</span>
                </div>
                
                <!-- Parent Tax Rate -->
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-slate-600">Parent Tax Rate:</span>
                  <span class="font-semibold">{{ selectedBaseline.scenario.parentTaxRate }}%</span>
                </div>
                
                <!-- Net Family Savings -->
                <div class="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span class="text-sm font-medium text-slate-600">Net Family Savings:</span>
                  <span 
                    class="font-bold text-lg"
                    :class="selectedBaseline.netFamilySavings > 0 ? 'text-success-700' : 'text-danger-700'"
                  >
                    {{ selectedBaseline.netFamilySavings > 0 ? '+' : '' }}{{ formatCurrency(selectedBaseline.netFamilySavings) }}
                  </span>
                </div>
                
                <!-- Success indicator for positive savings -->
                <div 
                  v-if="selectedBaseline.netFamilySavings > 0"
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
                <Tag
                  value="Selected as Baseline"
                  severity="info"
                  icon="pi pi-bookmark-fill"
                  class="w-full justify-center text-sm font-semibold px-3 py-2"
                />
              </div>
            </template>
          </Card>

          <!-- Multiple Custom Scenario Cards -->
          <Card 
            v-for="customScenario in customScenarios"
            :key="customScenario.id"
            class="scenario-card cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-success-300 bg-success-25"
            @click="editCustomScenario(customScenario)"
            role="button"
            :aria-label="`Edit ${customScenario.scenario.name}`"
            tabindex="0"
            @keydown.enter="editCustomScenario(customScenario)"
            @keydown.space.prevent="editCustomScenario(customScenario)"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-success-800">{{ customScenario.scenario.name }}</h3>
                  <Tag
                    value="Custom"
                    severity="success"
                    class="text-xs"
                  />
                </div>
                <i class="pi pi-user text-success-600 text-xl"></i>
              </div>
            </template>
            
            <template #content>
              <div class="space-y-3">
                <!-- Based on Baseline -->
                <div class="text-xs text-success-600 bg-success-100 px-2 py-1 rounded">
                  Based on {{ customScenario.baselineSource }}
                </div>
                
                <!-- Conversion Amount -->
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-slate-600">Conversion Amount:</span>
                  <span class="font-semibold">{{ formatCurrency(customScenario.scenario.conversionAmount) }}</span>
                </div>
                
                <!-- Parent Tax Rate -->
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-slate-600">Parent Tax Rate:</span>
                  <span class="font-semibold">{{ customScenario.scenario.parentTaxRate }}%</span>
                </div>
                
                <!-- Net Family Savings (Real Calculation) -->
                <div class="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span class="text-sm font-medium text-slate-600">Net Family Savings:</span>
                  <span 
                    class="font-bold text-lg"
                    :class="customScenario.netFamilySavings > 0 ? 'text-success-700' : 'text-danger-700'"
                  >
                    {{ customScenario.netFamilySavings > 0 ? '+' : '' }}{{ formatCurrency(customScenario.netFamilySavings) }}
                  </span>
                </div>
                
                <!-- Custom Success indicator -->
                <div class="flex items-center gap-2 p-2 bg-success-50 border border-success-200 rounded-md mt-3">
                  <i class="pi pi-check text-success-600"></i>
                  <span class="text-sm font-medium text-success-700">
                    Personalized analysis
                  </span>
                </div>
              </div>
            </template>
            
            <template #footer>
              <div class="space-y-2">
                <!-- Edit Button -->
                <div class="text-center">
                  <Button
                    @click.stop="editCustomScenario(customScenario)"
                    severity="success"
                    size="small"
                    icon="pi pi-pencil"
                    label="Edit Custom Strategy"
                    class="w-full"
                  />
                </div>
                
                <!-- Delete Button -->
                <div class="text-center">
                  <Button
                    @click.stop="deleteCustomScenario(customScenario)"
                    severity="secondary"
                    size="small"
                    icon="pi pi-trash"
                    label="Delete"
                    class="w-full text-sm"
                  />
                </div>
              </div>
            </template>
          </Card>

          <!-- Dynamic Add Custom Scenario Placeholder -->
          <Card 
            v-if="customScenarios.length === 0"
            class="custom-placeholder-card border-2 border-dashed border-primary-300 bg-primary-25 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
            @click="openPersonalizationModal"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-primary-700">Create Custom Scenario</h3>
                  <Tag
                    value="Personalized"
                    severity="success"
                    class="text-xs"
                  />
                </div>
                <i class="pi pi-plus-circle text-primary-600 text-xl"></i>
              </div>
            </template>
            
            <template #content>
              <div class="space-y-4 text-center py-4">
                <div class="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <i class="pi pi-sliders-h text-primary-600 text-2xl"></i>
                </div>
                <div>
                  <p class="text-primary-700 font-medium mb-2">Adjust assumptions to see how changes affect your analysis</p>
                  <p class="text-primary-600 text-sm">
                    Personalize tax rates, timeline, and family situation based on your specific circumstances
                  </p>
                </div>
              </div>
            </template>
            
            <template #footer>
              <div class="text-center">
                <Button
                  @click="openPersonalizationModal"
                  severity="primary"
                  size="small"
                  icon="pi pi-cog"
                  label="Personalize This Strategy"
                  class="w-full font-semibold"
                />
              </div>
            </template>
          </Card>

          <!-- Add Another Custom Scenario Placeholder (1-2 scenarios exist) -->
          <Card 
            v-else-if="customScenarios.length < 3"
            class="custom-placeholder-card border-2 border-dashed border-primary-300 bg-primary-25 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
            @click="openPersonalizationModal"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-primary-700">
                    {{ customScenarios.length === 1 ? 'Add Another Custom Scenario' : 'Add Third Custom Scenario' }}
                  </h3>
                  <Tag
                    :value="`${customScenarios.length + 1} of 3`"
                    severity="info"
                    class="text-xs"
                  />
                </div>
                <i class="pi pi-plus-circle text-primary-600 text-xl"></i>
              </div>
            </template>
            
            <template #content>
              <div class="space-y-4 text-center py-4">
                <div class="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <i class="pi pi-sliders-h text-primary-600 text-2xl"></i>
                </div>
                <div>
                  <p class="text-primary-700 font-medium mb-2">Create {{ customScenarios.length === 1 ? 'a second' : 'a third' }} personalized scenario</p>
                  <p class="text-primary-600 text-sm">
                    Compare multiple strategies with different assumptions side-by-side
                  </p>
                </div>
              </div>
            </template>
            
            <template #footer>
              <div class="text-center">
                <Button
                  @click="openPersonalizationModal"
                  severity="primary"
                  size="small"
                  icon="pi pi-plus"
                  :label="`Add ${customScenarios.length === 1 ? 'Second' : 'Third'} Scenario`"
                  class="w-full font-semibold"
                />
              </div>
            </template>
          </Card>

          <!-- Maximum Reached Indicator (3 scenarios exist) -->
          <Card 
            v-else-if="customScenarios.length >= 3"
            class="max-reached-card border-2 border-dashed border-slate-300 bg-slate-50 opacity-60"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-slate-500">Maximum Custom Scenarios</h3>
                  <Tag
                    value="3 of 3"
                    severity="secondary"
                    class="text-xs"
                  />
                </div>
                <i class="pi pi-check-circle text-slate-400 text-xl"></i>
              </div>
            </template>
            
            <template #content>
              <div class="space-y-4 text-center py-4">
                <div class="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <i class="pi pi-check text-slate-400 text-2xl"></i>
                </div>
                <div>
                  <p class="text-slate-500 font-medium mb-2">You've reached the maximum of 3 custom scenarios</p>
                  <p class="text-slate-400 text-sm">
                    Edit or delete existing scenarios to create new ones
                  </p>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Detailed Tables View -->
      <div v-else-if="selectedScenario && props.selectedCalculation" class="relative">
        <!-- Disabled Overlay when in personalization mode without baseline -->
        <div 
          v-if="personalizationMode && !selectedBaseline" 
          class="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-lg pointer-events-none z-10"
        ></div>
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

    <!-- Personalization Modal -->
    <ToolsRothConversionPersonalizationModal
      v-model:visible="showPersonalizationModal"
      :baseline-values="modalPersonalizationValues"
      @apply-changes="handlePersonalizationApply"
      @cancel="handlePersonalizationCancel"
    />
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
  calculateScenario,
  getScenarioClasses, 
  getScenarioIcon,
  formatTableData 
} = useRothCalculations()

// Template refs for smooth scrolling
const scenarioCardsRef = ref(null)

// Calculate all scenarios
const scenarioCalculations = computed(() => {
  return calculateAllScenarios(props.inputs)
})

// Phase 4A2: Filtered scenarios for baseline + custom scenario
const filteredScenarios = computed(() => {
  if (!personalizationMode.value || !selectedBaseline.value) {
    // Standard mode - show all 4 presets
    return scenarioCalculations.value
  } else {
    // Personalization mode with baseline - show baseline + custom scenarios
    const scenarios = [selectedBaseline.value]
    
    // Add custom scenarios if they exist
    if (customScenarios.value.length > 0) {
      scenarios.push(...customScenarios.value)
    }
    
    return scenarios
  }
})

// Track selected scenario
const selectedScenario = ref(null)
const showingTables = ref(false)

// Phase 4A1.1: Personalization mode state
const personalizationMode = ref(false)
const showPersonalizationModal = ref(false)

// Phase 4A1.2: Baseline selection state
const selectedBaseline = ref(null)

// Phase 4A1.4: Custom scenarios state (future-ready array)
const customScenarios = ref([])

// Modal editing state
const editingCustomScenario = ref(null)

// Values for modal pre-population (baseline or custom scenario)
const modalPersonalizationValues = computed(() => {
  // If editing a custom scenario, use its values
  if (editingCustomScenario.value) {
    return editingCustomScenario.value.personalizedValues
  }
  
  // Otherwise use baseline values for new custom scenario
  if (!selectedBaseline.value) return null
  
  const scenario = selectedBaseline.value.scenario
  return {
    conversionAmount: scenario.conversionAmount,
    conversionYears: 3, // Default from mock data
    parentTaxRate: scenario.parentTaxRate,
    childrenTaxRates: [...scenario.childTaxRates], // Clone array
    returnRate: 6.0, // Default from app config
    yearsUntilInheritance: 15 // Default from Phase 4A1+
  }
})

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
  
  // Scroll scenario cards into view using native browser API
  nextTick(() => {
    scenarioCardsRef.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
  })
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

/**
 * Enable personalization mode
 */
const enablePersonalizationMode = () => {
  personalizationMode.value = true
  console.log('Personalization mode enabled')
}

/**
 * Disable personalization mode and return to standard view
 */
const disablePersonalizationMode = () => {
  personalizationMode.value = false
  selectedBaseline.value = null // Clear baseline when exiting
  console.log('Returned to standard view')
}

/**
 * Select a scenario as the baseline for personalization
 * @param {Object} scenarioCalculation - Selected scenario calculation
 */
const selectBaseline = (scenarioCalculation) => {
  selectedBaseline.value = scenarioCalculation
  console.log('Baseline selected:', scenarioCalculation.scenario.name)
}

/**
 * Change the selected baseline (clear current selection)
 */
const changeBaseline = () => {
  selectedBaseline.value = null
  console.log('Baseline cleared - select new baseline')
}

/**
 * Open personalization modal (only if baseline is selected)
 */
const openPersonalizationModal = () => {
  if (!selectedBaseline.value) {
    console.warn('Cannot open personalization modal without baseline selection')
    return
  }
  showPersonalizationModal.value = true
}

/**
 * Handle personalization modal apply - create custom scenario with real calculations
 * @param {Object} personalizedValues - User's personalized inputs
 */
const handlePersonalizationApply = (personalizedValues) => {
  if (!selectedBaseline.value || !props.inputs) return
  
  // Determine scenario name and index for multiple scenarios
  const isEditing = editingCustomScenario.value !== null
  const scenarioNumber = isEditing 
    ? editingCustomScenario.value.scenario.name.match(/\d+/)?.[0] || customScenarios.value.length + 1
    : customScenarios.value.length + 1
  
  // Create custom scenario object for calculation
  const customScenarioTemplate = {
    name: `Custom Scenario ${scenarioNumber}`,
    conversionAmount: personalizedValues.conversionAmount,
    conversionYears: personalizedValues.conversionYears,
    parentTaxRate: personalizedValues.parentTaxRate,
    childTaxRates: [...personalizedValues.childrenTaxRates],
    returnRate: personalizedValues.returnRate,
    yearsUntilInheritance: personalizedValues.yearsUntilInheritance,
    colorTheme: 'success', // Green theme for custom
    isSweetSpot: false,
    isDangerous: false,
    isCustom: true
  }
  
  // Calculate real scenario results using useRothCalculations
  const calculationResult = calculateScenario(props.inputs, customScenarioTemplate)
  
  if (!calculationResult) {
    console.error('Failed to calculate custom scenario')
    return
  }
  
  // Create custom scenario with real calculation results
  const customScenario = {
    id: isEditing ? editingCustomScenario.value.id : `custom-${Date.now()}`, // Preserve ID when editing
    scenario: customScenarioTemplate,
    // Real calculation results
    netFamilySavings: calculationResult.netFamilySavings,
    growthTaxSavings: calculationResult.growthTaxSavings,
    doNothing: calculationResult.doNothing,
    strategic: calculationResult.strategic,
    totalGrowthAtStake: calculationResult.totalGrowthAtStake,
    personalizedValues: { ...personalizedValues }, // Store for editing
    baselineSource: selectedBaseline.value.scenario.name,
    isCustom: true
  }
  
  // Phase 4A1.5: Support multiple custom scenarios (max 3)
  if (isEditing) {
    // Update existing scenario
    const editIndex = customScenarios.value.findIndex(cs => cs.id === editingCustomScenario.value.id)
    if (editIndex !== -1) {
      customScenarios.value[editIndex] = customScenario
    }
  } else {
    // Add new scenario (max 3 total)
    if (customScenarios.value.length < 3) {
      customScenarios.value.push(customScenario)
    }
  }
  
  showPersonalizationModal.value = false
  editingCustomScenario.value = null // Clear editing state
  console.log('Custom scenario created with real calculations:', customScenario)
}


/**
 * Handle personalization modal cancel
 */
const handlePersonalizationCancel = () => {
  showPersonalizationModal.value = false
  editingCustomScenario.value = null // Clear editing state
  console.log('Personalization cancelled')
}

/**
 * Edit custom scenario - reopen modal with current values
 * @param {Object} customScenario - Custom scenario to edit
 */
const editCustomScenario = (customScenario) => {
  // Set editing context so modal uses custom scenario values
  editingCustomScenario.value = customScenario
  showPersonalizationModal.value = true
  console.log('Editing custom scenario:', customScenario.scenario.name)
}

/**
 * Delete custom scenario - remove from array and update placeholders
 * @param {Object} customScenario - Custom scenario to delete
 */
const deleteCustomScenario = (customScenario) => {
  const deleteIndex = customScenarios.value.findIndex(cs => cs.id === customScenario.id)
  if (deleteIndex !== -1) {
    customScenarios.value.splice(deleteIndex, 1)
    console.log('Deleted custom scenario:', customScenario.scenario.name)
    console.log('Remaining scenarios:', customScenarios.value.length)
  }
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

/* Custom placeholder card styling */
.custom-placeholder-card {
  transition: all 0.2s ease;
  background: linear-gradient(135deg, rgb(var(--primary-25)), rgb(var(--primary-50)));
}

.custom-placeholder-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border-color: rgb(var(--primary-400));
}
</style>