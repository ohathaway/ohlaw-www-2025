<template>
  <div class="min-h-screen bg-slate-100 p-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">
        Personalization Modal Test
      </h1>

      <Card class="mb-6">
        <template #title>
          <h2 class="text-xl font-semibold">
            Modal Testing
          </h2>
        </template>

        <template #content>
          <p class="text-slate-700 mb-4">
            Click the button below to test the personalization modal feel and flow.
            This is a static UX shell - sliders move but don't affect anything yet.
          </p>

          <Button
            severity="primary"
            label="Open Personalization Modal"
            icon="pi pi-cog"
            size="large"
            @click="showModal = true"
          />
        </template>
      </Card>

      <!-- Current Values Display -->
      <Card v-if="personalizedValues">
        <template #title>
          <h2 class="text-xl font-semibold">
            Last Applied Values
          </h2>
        </template>

        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Conversion Amount:</strong>
              ${{ (personalizedValues.conversionAmount / 1000).toFixed(0) }}K
            </div>
            <div>
              <strong>Timeline:</strong>
              {{ personalizedValues.conversionYears }} years
            </div>
            <div>
              <strong>Parent Tax Rate:</strong>
              {{ personalizedValues.parentTaxRate }}%
            </div>
            <div>
              <strong>Return Rate:</strong>
              {{ personalizedValues.returnRate }}%
            </div>
            <div>
              <strong>Years Until Inheritance:</strong>
              {{ personalizedValues.yearsUntilInheritance }} years
            </div>
            <div class="md:col-span-2">
              <strong>Children's Rates:</strong>
              {{ personalizedValues.childrenTaxRates.join('%, ') }}%
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Personalization Modal -->
    <ToolsRothConversionPersonalizationModal
      v-model:visible="showModal"
      @apply-changes="handleApplyChanges"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
const showModal = ref(false)
const personalizedValues = ref(null)

const handleApplyChanges = (values) => {
  personalizedValues.value = values
  console.log('Applied personalization values:', values)
}

const handleCancel = () => {
  console.log('Personalization cancelled')
}

// SEO
useHead({
  title: 'Personalization Modal Test',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})
</script>
