<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :closable="true"
    :draggable="false"
    class="personalization-modal"
    :style="{ width: '100vw', height: '100vh' }"
    :content-style="{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }"
  >
    <!-- Modal Header -->
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h2 class="text-2xl font-semibold mb-1">Personalize Your Analysis</h2>
          <p class="text-slate-600 text-sm">Adjust the assumptions to match your specific situation</p>
        </div>
      </div>
    </template>

    <!-- Modal Content -->
    <div class="flex-1 overflow-auto p-6 bg-slate-50">
      <div class="max-w-4xl mx-auto">
        <!-- Introduction Section -->
        <div class="mb-8 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <i class="pi pi-info-circle text-primary-600 text-2xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-2">Why Personalize Your Analysis?</h3>
              <p class="text-slate-700 mb-3">
                The default analysis uses standard assumptions that may not reflect your actual situation. 
                Personalizing these key variables will give you a more accurate picture of how Roth conversions 
                could impact your family's tax burden.
              </p>
              <p class="text-slate-600 text-sm">
                Each variable affects your results differently. Take time to adjust them based on your 
                financial advisor's guidance and your family's specific circumstances.
              </p>
            </div>
          </div>
        </div>

        <!-- Variable Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 justify-items-center">
          <!-- Total Conversion Amount Card -->
          <Card class="variable-card">
            <template #title>
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-semibold">Total Conversion Amount</h4>
                <Tag value="High Impact" severity="danger" class="text-xs" />
              </div>
            </template>
            
            <template #content>
              <div v-if="!showConversionSlider" class="flex flex-col h-full">
                <div class="flex-1 space-y-4">
                  <p class="text-slate-700 text-sm">
                    How much of your pre-tax retirement accounts do you want to convert to Roth? 
                    This is typically done over several years to manage tax brackets.
                  </p>
                  <div class="bg-info-50 border border-info-200 rounded-md p-3">
                    <p class="text-info-800 text-sm">
                      <strong>Current:</strong> $545K (25% of $2.18M)<br>
                      <strong>Range:</strong> $0 to $2.18M (your total pre-tax accounts)
                    </p>
                  </div>
                </div>
                <Button 
                  @click="openSlider('conversion')"
                  severity="primary"
                  size="small"
                  icon="pi pi-sliders-h"
                  label="Adjust Amount"
                  class="w-full mt-auto"
                />
              </div>
              
              <div v-else class="space-y-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary-700 mb-1">${{ (conversionAmount / 1000).toFixed(0) }}K</div>
                  <div class="text-sm text-slate-600">{{ Math.round((conversionAmount / 2180000) * 100) }}% of pre-tax accounts</div>
                </div>
                <Slider 
                  v-model="conversionAmount" 
                  :min="0" 
                  :max="2180000" 
                  :step="25000"
                  class="w-full"
                />
                <div class="flex justify-between text-xs text-slate-500">
                  <span>$0</span>
                  <span>$2.18M</span>
                </div>
                <Button 
                  @click="showConversionSlider = false"
                  severity="success"
                  size="small"
                  icon="pi pi-check"
                  label="Done"
                  class="w-full"
                />
              </div>
            </template>
          </Card>

          <!-- Conversion Timeline Card -->
          <Card class="variable-card">
            <template #title>
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-semibold">Conversion Timeline</h4>
                <Tag value="Medium Impact" severity="warn" class="text-xs" />
              </div>
            </template>
            
            <template #content>
              <div v-if="!showTimelineSlider" class="flex flex-col h-full">
                <div class="flex-1 space-y-4">
                  <p class="text-slate-700 text-sm">
                    Over how many years will you spread the conversions? Longer timelines can help 
                    manage tax bracket impacts but delay the tax-free growth benefits.
                  </p>
                  <div class="bg-info-50 border border-info-200 rounded-md p-3">
                    <p class="text-info-800 text-sm">
                      <strong>Current:</strong> 3 years<br>
                      <strong>Range:</strong> 1 to 10 years
                    </p>
                  </div>
                </div>
                <Button 
                  @click="openSlider('timeline')"
                  severity="primary"
                  size="small"
                  icon="pi pi-sliders-h"
                  label="Adjust Timeline"
                  class="w-full mt-auto"
                />
              </div>
              
              <div v-else class="space-y-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary-700 mb-1">{{ conversionYears }} {{ conversionYears === 1 ? 'Year' : 'Years' }}</div>
                  <div class="text-sm text-slate-600">${{ Math.round(conversionAmount / conversionYears / 1000) }}K per year</div>
                </div>
                <Slider 
                  v-model="conversionYears" 
                  :min="1" 
                  :max="10" 
                  :step="1"
                  class="w-full"
                />
                <div class="flex justify-between text-xs text-slate-500">
                  <span>1 year</span>
                  <span>10 years</span>
                </div>
                <Button 
                  @click="showTimelineSlider = false"
                  severity="success"
                  size="small"
                  icon="pi pi-check"
                  label="Done"
                  class="w-full"
                />
              </div>
            </template>
          </Card>

          <!-- Parent Tax Rate Card -->
          <Card class="variable-card">
            <template #title>
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-semibold">Your Current Tax Rate</h4>
                <Tag value="High Impact" severity="danger" class="text-xs" />
              </div>
            </template>
            
            <template #content>
              <div v-if="!showParentTaxSlider" class="flex flex-col h-full">
                <div class="flex-1 space-y-4">
                  <p class="text-slate-700 text-sm">
                    Your marginal tax rate during conversion years. This includes federal and state taxes 
                    and determines how much you'll pay on the conversion.
                  </p>
                  <div class="bg-info-50 border border-info-200 rounded-md p-3">
                    <p class="text-info-800 text-sm">
                      <strong>Current:</strong> 24% (22% federal + 2% state)<br>
                      <strong>Range:</strong> 10% to 37%
                    </p>
                  </div>
                </div>
                <Button 
                  @click="openSlider('parentTax')"
                  severity="primary"
                  size="small"
                  icon="pi pi-sliders-h"
                  label="Adjust Rate"
                  class="w-full mt-auto"
                />
              </div>
              
              <div v-else class="space-y-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary-700 mb-1">{{ parentTaxRate }}%</div>
                  <div class="text-sm text-slate-600">{{ getTaxBracketDescription(parentTaxRate) }}</div>
                </div>
                <Slider 
                  v-model="parentTaxRate" 
                  :min="10" 
                  :max="37" 
                  :step="1"
                  class="w-full"
                />
                <div class="flex justify-between text-xs text-slate-500">
                  <span>10%</span>
                  <span>37%</span>
                </div>
                <!-- Tax Bracket Markers -->
                <div class="flex justify-between text-xs text-slate-400 mt-1">
                  <span>12%</span>
                  <span>22%</span>
                  <span>24%</span>
                  <span>32%</span>
                  <span>35%</span>
                </div>
                <Button 
                  @click="showParentTaxSlider = false"
                  severity="success"
                  size="small"
                  icon="pi pi-check"
                  label="Done"
                  class="w-full"
                />
              </div>
            </template>
          </Card>

          <!-- Children's Tax Rates Card -->
          <Card class="variable-card">
            <template #title>
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-semibold">Children's Tax Rates</h4>
                <Tag value="High Impact" severity="danger" class="text-xs" />
              </div>
            </template>
            
            <template #content>
              <div v-if="!showChildrenTaxSlider" class="flex flex-col h-full">
                <div class="flex-1 space-y-4">
                  <p class="text-slate-700 text-sm">
                    Expected tax rates for your children when they inherit and must distribute the accounts 
                    (likely during their peak earning years).
                  </p>
                  <div class="bg-info-50 border border-info-200 rounded-md p-3">
                    <p class="text-info-800 text-sm">
                      <strong>Current:</strong> 22-24% for all children<br>
                      <strong>Range:</strong> 10% to 37% each
                    </p>
                  </div>
                </div>
                <Button 
                  @click="openSlider('childrenTax')"
                  severity="primary"
                  size="small"
                  icon="pi pi-sliders-h"
                  label="Adjust Rates"
                  class="w-full mt-auto"
                />
              </div>
              
              <div v-else class="space-y-4">
                <div class="space-y-3">
                  <div v-for="(rate, index) in childrenTaxRates" :key="index" class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium">Child {{ index + 1 }}</span>
                      <span class="text-lg font-bold text-primary-700">{{ rate }}%</span>
                    </div>
                    <Slider 
                      v-model="childrenTaxRates[index]" 
                      :min="10" 
                      :max="37" 
                      :step="1"
                      class="w-full"
                    />
                  </div>
                </div>
                <Button 
                  @click="showChildrenTaxSlider = false"
                  severity="success"
                  size="small"
                  icon="pi pi-check"
                  label="Done"
                  class="w-full"
                />
              </div>
            </template>
          </Card>

          <!-- Investment Return Rate Card -->
          <Card class="variable-card">
            <template #title>
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-semibold">Investment Return Rate</h4>
                <Tag value="Medium Impact" severity="warn" class="text-xs" />
              </div>
            </template>
            
            <template #content>
              <div v-if="!showReturnSlider" class="flex flex-col h-full">
                <div class="flex-1 space-y-4">
                  <p class="text-slate-700 text-sm">
                    Expected annual return on investments during the 10-year distribution period. 
                    Higher returns increase the tax advantages of Roth conversions since more growth occurs tax-free.
                  </p>
                  <div class="bg-info-50 border border-info-200 rounded-md p-3">
                    <p class="text-info-800 text-sm">
                      <strong>Current:</strong> 6% annually<br>
                      <strong>Range:</strong> 2% (conservative) to 18% (aggressive)<br>
                      <strong>Note:</strong> Historical stock market average is ~10%
                    </p>
                  </div>
                </div>
                <Button 
                  @click="openSlider('return')"
                  severity="primary"
                  size="small"
                  icon="pi pi-sliders-h"
                  label="Adjust Return"
                  class="w-full mt-auto"
                />
              </div>
              
              <div v-else class="space-y-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary-700 mb-1">{{ returnRate }}%</div>
                  <div class="text-sm text-slate-600">{{ getReturnDescription(returnRate) }}</div>
                </div>
                <div class="max-w-md mx-auto">
                  <Slider 
                    v-model="returnRate" 
                    :min="2" 
                    :max="18" 
                    :step="0.5"
                    class="w-full"
                  />
                  <div class="flex justify-between text-xs text-slate-500 mt-1">
                    <span>2%</span>
                    <span>6%</span>
                    <span>10%</span>
                    <span>18%</span>
                  </div>
                  <div class="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Conservative</span>
                    <span>Moderate</span>
                    <span>Historical Avg</span>
                    <span>Aggressive</span>
                  </div>
                </div>
                <div class="text-center">
                  <Button 
                    @click="showReturnSlider = false"
                    severity="success"
                    size="small"
                    icon="pi pi-check"
                    label="Done"
                    class="max-w-xs"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- Modal Footer -->
    <template #footer>
      <div class="flex justify-between items-center w-full p-6 border-t border-slate-200 bg-white">
        <div class="text-sm text-slate-600">
          Changes will update your analysis with personalized assumptions
        </div>
        <div class="flex gap-3">
          <Button
            @click="cancelPersonalization"
            severity="secondary"
            label="Cancel"
            icon="pi pi-times"
          />
          <Button
            @click="applyPersonalization"
            severity="primary"
            label="Apply Changes"
            icon="pi pi-check"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'apply-changes', 'cancel'])

// Progressive disclosure state
const showConversionSlider = ref(false)
const showTimelineSlider = ref(false)
const showParentTaxSlider = ref(false)
const showChildrenTaxSlider = ref(false)
const showReturnSlider = ref(false)

// Helper function to open a slider and close others
const openSlider = (sliderType) => {
  // Close all sliders first
  showConversionSlider.value = false
  showTimelineSlider.value = false
  showParentTaxSlider.value = false
  showChildrenTaxSlider.value = false
  showReturnSlider.value = false
  
  // Open the requested slider
  switch (sliderType) {
    case 'conversion':
      showConversionSlider.value = true
      break
    case 'timeline':
      showTimelineSlider.value = true
      break
    case 'parentTax':
      showParentTaxSlider.value = true
      break
    case 'childrenTax':
      showChildrenTaxSlider.value = true
      break
    case 'return':
      showReturnSlider.value = true
      break
  }
}

// Mock variable values
const conversionAmount = ref(545000) // $545K
const conversionYears = ref(3)
const parentTaxRate = ref(24)
const childrenTaxRates = ref([22, 24, 22, 24]) // 4 children
const returnRate = ref(6.0)

// Helper functions for descriptions
const getTaxBracketDescription = (rate) => {
  if (rate <= 12) return 'Low bracket'
  if (rate <= 22) return 'Middle bracket'
  if (rate <= 24) return 'Upper-middle bracket'
  if (rate <= 32) return 'High bracket'
  return 'Top bracket'
}

const getReturnDescription = (rate) => {
  if (rate <= 3) return 'Very conservative'
  if (rate <= 5) return 'Conservative'
  if (rate <= 7) return 'Moderate'
  if (rate <= 10) return 'Historical average'
  if (rate <= 12) return 'Optimistic'
  return 'Very aggressive'
}

// Modal actions
const cancelPersonalization = () => {
  emit('cancel')
  emit('update:visible', false)
}

const applyPersonalization = () => {
  // Emit the personalized values (static for now)
  const personalizedValues = {
    conversionAmount: conversionAmount.value,
    conversionYears: conversionYears.value,
    parentTaxRate: parentTaxRate.value,
    childrenTaxRates: [...childrenTaxRates.value],
    returnRate: returnRate.value
  }
  
  emit('apply-changes', personalizedValues)
  emit('update:visible', false)
}
</script>

<style scoped>
.personalization-modal :deep(.p-dialog) {
  border-radius: 0;
  box-shadow: none;
}

.personalization-modal :deep(.p-dialog-header) {
  border-bottom: 1px solid rgb(226 232 240);
  background: white;
}

.personalization-modal :deep(.p-dialog-content) {
  padding: 0;
}

.variable-card {
  transition: all 0.2s ease;
  width: 100%;
  max-width: 480px; /* Wider cards */
  height: 100%; /* Consistent height */
  display: flex;
  flex-direction: column;
}

.variable-card :deep(.p-card-content) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.variable-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Slider enhancements */
:deep(.p-slider) {
  background: rgb(203 213 225); /* slate-300 - more visible on white */
  height: 8px;
  border-radius: 4px;
}

:deep(.p-slider .p-slider-range) {
  background: rgb(var(--primary-500));
  border-radius: 4px;
}

:deep(.p-slider .p-slider-handle) {
  border: 3px solid rgb(var(--primary-600));
  background: rgb(var(--primary-50));
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.2);
  transition: all 0.2s ease;
}

:deep(.p-slider .p-slider-handle:hover) {
  border-color: rgb(var(--primary-700));
  background: rgb(var(--primary-100));
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.25);
}
</style>