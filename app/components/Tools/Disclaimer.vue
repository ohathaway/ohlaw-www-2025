<template>
  <div>
    <!-- Full Disclaimer -->
    <div v-if="showDisclaimer" class="mt-8 p-4 bg-yellow-50 rounded-lg relative">
      <p class="text-sm text-blue-800 pr-16">
        <strong>Professional Note:</strong> This calculator provides educational estimates only. 
        Actual tax and investment consequences depend on many factors including future tax law changes, income levels, 
        and specific implementation strategies. Consult with tax and financial professionals for personalized advice.
      </p>
      <Button
        @click="hideDisclaimer"
        size="small"
        variant="text"
        class="absolute top-3 right-3"
      >
        Got it
      </Button>
    </div>

    <!-- Stub Button -->
    <div v-else class="mt-8 flex justify-center">
      <Button
        @click="showDisclaimer = true"
        severity="secondary"
        size="small"
        variant="text"
        outlined
        class="absolute top-3 right-3"
      >
        Show Disclaimer
      </Button>
    </div>
  </div>
</template>

<script setup>
const showDisclaimer = ref(true)

const hideDisclaimer = () => {
  showDisclaimer.value = false
}
</script>