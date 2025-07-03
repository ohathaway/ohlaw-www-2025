<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Your Retirement Accounts Have a Tax Problem</h1>
      <p class="text-slate-600">The SECURE 2.0 Act in 2022 turned traditional retirement planning on its head. Your beneficiary designations that made perfect sense in 2021?</p>
      <p class="text-slate-600">Your beneficiary designations that made perfect sense in 2021? They might be setting your family up for a massive tax bill. But you have options.</p>
      <p class="text-slate-600">This analysis takes about 2 minutes and usually leads to some very important conversations with your financial team.</p>
    </div>

    <Card class="p-6 shadow-sm">
      <template #title>
        <h2 class="text-xl font-semibold">Account Information</h2>
      </template>
      
      <template #content>
        <form @submit.prevent="generateAnalysis" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            <!-- Total Pre-Tax Retirement Accounts -->
            <div class="flex flex-col">
              <label class="block text-sm font-medium text-slate-700 flex items-center mb-2">
                Total Pre-Tax Retirement Accounts
                <LayoutInfoIcon 
                  tooltip="Include account balances that will be inherited (401k, IRA, 457b, TSP). Exclude monthly pensions (PERA DB, FERS annuity) as these typically end at death or continue as survivor benefits."
                />
              </label>
              <InputNumber
                v-model="formData.totalPreTaxAccounts"
                :min="0"
                mode="currency" 
                currency="USD"
                class="w-full"
                inputClass="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                :class="{'p-invalid': !formData.totalPreTaxAccounts && showValidation}"
              />
            </div>

            <!-- Total Roth Accounts -->
            <div class="flex flex-col">
              <label class="block text-sm font-medium text-slate-700 flex items-center mb-2">
                Total Roth Accounts
                <LayoutInfoIcon 
                  tooltip="Include all Roth IRAs and Roth 401(k)s. These accounts are tax-free to beneficiaries and provide much more flexibility under SECURE 2.0, though still subject to the 10-year rule."
                />
              </label>
              <InputNumber
                v-model="formData.totalRothAccounts"
                :min="0"
                mode="currency" 
                currency="USD"
                class="w-full"
                inputClass="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                :class="{'p-invalid': !formData.totalRothAccounts && showValidation}"
              />
            </div>

            <!-- Number of Children -->
            <div class="flex flex-col">
              <label class="block text-sm font-medium text-slate-700 flex items-center mb-2">
                Number of Children (1-4)
                <LayoutInfoIcon 
                  tooltip="Non-spouse beneficiaries who will inherit retirement accounts. Under SECURE 2.0, each child must distribute their inherited retirement accounts within 10 years, potentially creating significant tax consequences."
                />
              </label>
              <InputNumber
                v-model="formData.numberOfChildren"
                :min="1"
                :max="4"
                :useGrouping="false"
                class="w-full"
                inputClass="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                :class="{'p-invalid': (!formData.numberOfChildren || formData.numberOfChildren < 1 || formData.numberOfChildren > 4) && showValidation}"
              />
            </div>
          </div>

          <!-- Generate Analysis Button -->
          <div class="flex justify-center pt-4">
            <Button
              type="submit"
              :disabled="!isFormValid"
              :loading="isGenerating"
              :class="[
                'px-8 py-3 rounded-md font-medium',
                isFormValid
                  ? 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              ]"
            >
              Generate Analysis
            </Button>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useRothConversionStore } from '~/stores/rothConversionStore'

// Use the Roth Conversion store
const store = useRothConversionStore()

// Get app config for default values
const appConfig = useAppConfig()

// Form data with pre-filled values from config
const formData = reactive({
  totalPreTaxAccounts: appConfig.tools?.rothConversion?.formDefaults?.totalPreTaxAccounts || 0,
  totalRothAccounts: appConfig.tools?.rothConversion?.formDefaults?.totalRothAccounts || 0,
  numberOfChildren: appConfig.tools?.rothConversion?.formDefaults?.numberOfChildren || 1
})

const isGenerating = ref(false)
const showValidation = ref(false)

// Form validation
const isFormValid = computed(() => {
  return formData.totalPreTaxAccounts > 0 && 
         formData.totalRothAccounts >= 0 && 
         formData.numberOfChildren >= 1 && 
         formData.numberOfChildren <= 4
})

// Form submission - dispatch to store
const generateAnalysis = async () => {
  showValidation.value = true
  
  if (!isFormValid.value) {
    return
  }
  
  try {
    isGenerating.value = true
    
    // Dispatch to store - triggers analysis generation
    store.generateAnalysis({ ...formData })
    
    // Scroll to top to reveal ScenarioGridView
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
  } catch (error) {
    // Error handling without console output
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
/* Enhanced validation styling */
:deep(.p-invalid input) {
  border-color: #ef4444;
}

:deep(.p-invalid input:focus) {
  --tw-ring-color: #ef4444;
}
</style>