<template>
  <div class="pdf-download-button">
    <Button
      v-if="pdfUrl"
      :loading="isDownloading"
      @click="handleDownload"
      severity="secondary"
      size="small"
      class="gap-2"
    >
      <i class="pi pi-file-pdf text-red-600" />
      Download PDF
    </Button>
    
    <Button
      v-else-if="!isChecking"
      :loading="isGenerating"
      @click="handleGenerate"
      severity="secondary"
      size="small"
      class="gap-2"
    >
      <i class="pi pi-file-pdf text-gray-400" />
      Generate PDF
    </Button>
    
    <div v-else class="text-sm text-gray-500">
      <i class="pi pi-spinner animate-spin" />
      Checking PDF...
    </div>
  </div>
</template>

<script setup>
/**
 * Blog PDF Download Button Component
 * Handles PDF generation and download for blog posts
 */

defineProps({
  slug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const { generatePDF, getPDFUrl, downloadPDF } = useBlogPDF()

// Reactive state
const pdfUrl = ref(null)
const isChecking = ref(true)
const isGenerating = ref(false)
const isDownloading = ref(false)

// Check if PDF exists on mount
onMounted(async () => {
  try {
    pdfUrl.value = await getPDFUrl(props.slug)
  }
  catch (error) {
    console.warn('PDF not found:', error.message)
  }
  finally {
    isChecking.value = false
  }
})

// Handle PDF generation
const handleGenerate = async () => {
  isGenerating.value = true
  
  try {
    const result = await generatePDF(props.slug)
    pdfUrl.value = result.pdf
    
    // Show success message
    $toast.success('PDF generated successfully!')
  }
  catch (error) {
    console.error('PDF generation failed:', error)
    $toast.error('Failed to generate PDF. Please try again.')
  }
  finally {
    isGenerating.value = false
  }
}

// Handle PDF download
const handleDownload = async () => {
  isDownloading.value = true
  
  try {
    await downloadPDF(props.slug, props.title)
  }
  catch (error) {
    console.error('PDF download failed:', error)
    $toast.error('Failed to download PDF. Please try again.')
  }
  finally {
    isDownloading.value = false
  }
}
</script>

<style scoped>
.pdf-download-button {
  display: inline-flex;
  align-items: center;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>