<script setup>
const route = useRoute()
const { authFetch } = useAdminAuth()

const document = ref(null)
const sessions = ref([])
const loading = ref(true)
const error = ref(null)
const showContent = ref(false)

const fetchDocument = async () => {
  loading.value = true
  try {
    const result = await authFetch(
      `/api/admin/esign/documents/`
      + `${route.params.id}`,
    )
    document.value = result.document
    sessions.value = result.sessions
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
  finally {
    loading.value = false
  }
}

onMounted(fetchDocument)

const statusColors = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SENT: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  VOIDED: 'bg-red-100 text-red-700',
}

const pdfLabel = computed(() =>
  document.value?.status === 'COMPLETED'
    ? 'View PDF'
    : 'Preview PDF',
)

// Live signer count — reads from the Pinia
// store (reactive as signers are added/removed)
const draftStore = useEsignDraftStore()
const { signers: draftSigners }
  = storeToRefs(draftStore)

const effectiveSignerCount = computed(() =>
  draftSigners.value.length || 1,
)

// Extract stored signers from document
const storedSigners = computed(() => {
  const doc = document.value
  if (!doc?.templateVars) return null
  try {
    const vars = typeof doc.templateVars
      === 'string'
      ? JSON.parse(doc.templateVars)
      : doc.templateVars
    return vars?.signers ?? null
  }
  catch { return null }
})

// Actions
const actionError = ref(null)

const handleDownload = async () => {
  try {
    const pdfBlob = await authFetch(
      `/api/admin/esign/documents/`
      + `${route.params.id}/download`,
      { responseType: 'blob' },
    )
    const url = URL.createObjectURL(pdfBlob)
    const a = window.document.createElement('a')
    a.href = url
    a.download
      = `${document.value.title}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }
  catch (err) {
    actionError.value
      = err.data?.message ?? err.message
  }
}

const generatingPdf = ref(false)
const handleGeneratePdf = async () => {
  generatingPdf.value = true
  actionError.value = null
  try {
    await authFetch(
      `/api/admin/esign/documents/`
      + `${route.params.id}/generate-pdf`,
      { method: 'POST' },
    )
    await fetchDocument()
    await handleDownload()
  }
  catch (err) {
    actionError.value
      = err.data?.message ?? err.message
  }
  finally {
    generatingPdf.value = false
  }
}

const handleVoid = async () => {
  if (
    !confirm(
      'Void this document? This cannot '
      + 'be undone.',
    )
  ) return

  try {
    await authFetch(
      `/api/admin/esign/documents/`
      + `${route.params.id}`,
      { method: 'DELETE' },
    )
    await fetchDocument()
  }
  catch (err) {
    actionError.value
      = err.data?.message ?? err.message
  }
}
</script>

<template>
  <div>
    <NuxtLink
      to="/admin/esign"
      class="text-sm text-slate-500
        hover:text-slate-700 mb-4 inline-block"
    >
      &larr; Back to Documents
    </NuxtLink>

    <div
      v-if="loading"
      class="text-center py-12 text-slate-400"
    >
      Loading...
    </div>

    <div
      v-else-if="error"
      class="text-center py-12 text-red-500"
    >
      {{ error }}
    </div>

    <template v-else-if="document">
      <!-- Header -->
      <div
        class="flex items-start justify-between
          mb-6"
      >
        <div>
          <h1
            class="text-2xl font-bold
              text-slate-800"
          >
            {{ document.title }}
          </h1>
          <div
            class="flex items-center gap-3 mt-2"
          >
            <span
              class="px-2 py-1 rounded-full
                text-xs font-medium"
              :class="
                statusColors[document.status]"
            >
              {{ document.status }}
            </span>
            <span class="text-sm text-slate-500">
              {{ effectiveSignerCount }} signer{{
                effectiveSignerCount > 1
                  ? 's' : '' }}
            </span>
          </div>
        </div>

        <div class="flex gap-2 items-start">
          <NuxtLink
            v-if="document.status === 'DRAFT'"
            :to="`/admin/esign/${
              route.params.id}/prepare`"
            class="px-4 py-2 bg-[#1E3A5F]
              text-white rounded-lg text-sm
              font-medium hover:bg-[#2a4d7a]
              transition-colors"
          >
            Prepare Document
          </NuxtLink>
          <EsignPdfPreview
            :document-id="route.params.id"
            :label="pdfLabel"
          />
          <button
            v-if="document.status === 'COMPLETED'
              && document.signedPdfBlobKey"
            class="px-4 py-2 bg-[#1E3A5F]
              text-white rounded-lg text-sm
              font-medium hover:bg-[#2a4d7a]
              transition-colors"
            @click="handleDownload"
          >
            Download PDF
          </button>
          <button
            v-if="document.status === 'COMPLETED'"
            :disabled="generatingPdf"
            class="px-4 py-2 border
              border-slate-300 text-slate-700
              rounded-lg text-sm font-medium
              hover:bg-slate-50
              transition-colors
              disabled:opacity-50"
            @click="handleGeneratePdf"
          >
            {{ generatingPdf
              ? 'Generating...'
              : 'Regenerate PDF' }}
          </button>
          <button
            v-if="document.status !== 'COMPLETED'
              && document.status !== 'VOIDED'"
            class="px-4 py-2 border
              border-red-300 text-red-600
              rounded-lg text-sm font-medium
              hover:bg-red-50
              transition-colors"
            @click="handleVoid"
          >
            Void Document
          </button>
        </div>
      </div>

      <!-- Send for Signature (DRAFT only) -->
      <EsignSignerManager
        v-if="document.status === 'DRAFT'
          && !sessions.length"
        :document-id="route.params.id"
        :signer-count="effectiveSignerCount"
        :initial-signers="storedSigners"
        class="mb-6"
        @sent="fetchDocument"
      />

      <!-- Signing Sessions -->
      <EsignSessionList
        :sessions="sessions"
        class="mb-6"
        @refresh="fetchDocument"
      />

      <!-- Document Content (collapsible) -->
      <div
        class="bg-white rounded-lg border
          border-slate-200"
      >
        <button
          class="w-full px-4 py-3 border-b
            border-slate-200 flex items-center
            justify-between cursor-pointer
            hover:bg-slate-50 transition-colors"
          @click="showContent = !showContent"
        >
          <h2
            class="text-sm font-semibold
              text-slate-700"
          >
            Document Content
          </h2>
          <i
            class="bi text-slate-400"
            :class="showContent
              ? 'bi-chevron-up'
              : 'bi-chevron-down'"
          />
        </button>
        <div
          v-show="showContent"
          class="p-6 prose prose-sm max-w-none"
          v-html="document.contentHtml"
        />
      </div>

      <p
        v-if="actionError"
        class="mt-4 text-sm text-red-600"
      >
        {{ actionError }}
      </p>
    </template>
  </div>
</template>
