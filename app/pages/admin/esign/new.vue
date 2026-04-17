<script setup>
const { authFetch } = useAdminAuth()
const router = useRouter()

const mode = ref('template')
const submitting = ref(false)
const error = ref(null)

// Templates from DB
const templates = ref([])
const selectedTemplateId = ref('')
const templateFields = ref([])
const fieldValues = ref({})

const route = useRoute()

// Clear store if starting a new document
// (not returning from prep)
const _draftInit = useEsignDraftStore()
if (!route.query.templateId) {
  _draftInit.clear()
}

onMounted(async () => {
  try {
    const result = await authFetch(
      '/api/admin/esign/templates',
    )
    templates.value = result.templates

    // Pre-select from query param or first
    const queryId = route.query.templateId
    const match = queryId
      && templates.value.find(
        t => t.id === queryId,
      )
    selectedTemplateId.value = match
      ? match.id
      : templates.value[0]?.id ?? ''
  }
  catch (err) {
    console.error('Failed to load templates:', err)
  }
})

const selectedTemplate = computed(() =>
  templates.value.find(
    t => t.id === selectedTemplateId.value,
  ),
)

// When template changes, update field list
watch(selectedTemplateId, (id) => {
  const tmpl = templates.value.find(
    t => t.id === id,
  )
  if (!tmpl) {
    templateFields.value = []
    return
  }
  const fields = JSON.parse(tmpl.fields ?? '[]')
  templateFields.value = fields

  // Preserve existing values, add new fields
  const existing = { ...fieldValues.value }
  fieldValues.value = {}
  fields.forEach((f) => {
    fieldValues.value[f] = existing[f] ?? ''
  })
}, { immediate: true })

// Lawmatics lookup
const lmQuery = ref('')
const lmResults = ref([])
const lmSearching = ref(false)
const lmLoading = ref(false)

const searchLawmatics = async () => {
  if (!lmQuery.value.trim()) return
  lmSearching.value = true
  lmResults.value = []

  try {
    const { matters } = await authFetch(
      `/api/admin/esign/lawmatics-lookup`
      + `?q=${encodeURIComponent(
        lmQuery.value)}`,
    )
    lmResults.value = matters
  }
  catch (err) {
    console.error('Lawmatics search:', err)
  }
  finally {
    lmSearching.value = false
  }
}

const selectMatter = async (matter) => {
  lmLoading.value = true
  try {
    const { vars } = await authFetch(
      `/api/admin/esign/lawmatics-lookup`
      + `?id=${matter.id}`,
    )

    // Use template's field mappings to fill
    // values from Lawmatics data
    const lmData = vars.lmFields ?? vars
    const tmpl = selectedTemplate.value
    const mappings = tmpl?.fieldMappings
      ? JSON.parse(tmpl.fieldMappings)
      : {}

    templateFields.value.forEach((field) => {
      const lmField = mappings[field]
      if (lmField && lmData[lmField]) {
        fieldValues.value[field]
          = String(lmData[lmField])
      }
      // Fallback: direct name match
      else if (lmData[field]) {
        fieldValues.value[field]
          = String(lmData[field])
      }
    })

    // Fill signers
    if (vars.isJoint && vars.spouseInfo) {
      signers.value = [
        {
          name: vars.clientName ?? '',
          email: vars.clientEmail ?? '',
          role: 'primary',
        },
        {
          name: vars.spouseInfo.name ?? '',
          email: vars.spouseInfo.email ?? '',
          role: 'joint',
        },
      ]
    }
    else {
      signers.value = [{
        name: vars.clientName ?? '',
        email: vars.clientEmail ?? '',
        role: 'primary',
      }]
    }

    lmResults.value = []
    lmQuery.value = ''
  }
  catch (err) {
    console.error('Matter lookup:', err)
  }
  finally {
    lmLoading.value = false
  }
}

// Ad hoc mode — signers managed by store
const draftStore = useEsignDraftStore()
const { signers: draftSigners }
  = storeToRefs(draftStore)
const adhocTitle = ref('')
const adhocFile = ref(null)
const creatingAdhoc = ref(false)
const adhocSignerCount = ref(
  draftSigners.value.length,
)

watch(adhocSignerCount, (count) => {
  draftStore.setSignerCount(count)
})

const handleAdhocFileSelect = (event) => {
  adhocFile.value
    = event.target.files?.[0] ?? null
  if (adhocFile.value && !adhocTitle.value) {
    adhocTitle.value
      = adhocFile.value.name
        .replace(/\.docx$/i, '')
  }
}

const createAdhocDocument = async () => {
  if (!adhocFile.value || !adhocTitle.value) {
    return
  }

  creatingAdhoc.value = true
  error.value = null

  try {
    // Convert file to base64 in chunks
    const fileBuffer = await adhocFile.value
      .arrayBuffer()
    const bytes = new Uint8Array(fileBuffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    const fileBase64 = btoa(binary)

    const { document } = await authFetch(
      '/api/admin/esign/documents-adhoc',
      {
        method: 'POST',
        body: {
          title: adhocTitle.value,
          fileName: adhocFile.value.name,
          fileBase64,
          signerCount: adhocSignerCount.value,
          signers: toRaw(draftSigners.value),
        },
      },
    )

    draftStore.setDocumentId(document.id)
    router.push(
      `/admin/esign/${document.id}/prepare`,
    )
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
  finally {
    creatingAdhoc.value = false
  }
}

// Both modes use the store for signers
const signers = draftSigners

const title = computed(() => {
  if (mode.value !== 'template') {
    return adhocTitle.value
  }
  const tmpl = selectedTemplate.value
  const name = fieldValues.value.clientName
    || 'Client'
  return tmpl
    ? `${tmpl.name} — ${name}`
    : name
})

const canSubmit = computed(() => {
  if (submitting.value) return false

  const hasSigners = signers.value.every(
    s => s.name && s.email,
  )
  if (!hasSigners) return false

  if (mode.value === 'template') {
    const tmpl = selectedTemplate.value
    const optSet = new Set(
      tmpl?.optionalFields
        ? JSON.parse(tmpl.optionalFields)
        : [],
    )
    return selectedTemplateId.value
      && templateFields.value.every(
        f => optSet.has(f)
          || fieldValues.value[f],
      )
  }

  // Ad hoc uses its own createAdhocDocument
  return false
})

const buildPayload = () => {
  return {
    title: title.value,
    templateId: selectedTemplateId.value,
    templateVars: { ...fieldValues.value },
    signerCount: signers.value.length,
  }
}

const submit = async () => {
  if (!canSubmit.value) return

  submitting.value = true
  error.value = null

  try {
    const payload = buildPayload()

    const { document } = await authFetch(
      '/api/admin/esign/documents',
      { method: 'POST', body: payload },
    )

    await authFetch(
      `/api/admin/esign/documents/`
      + `${document.id}/send`,
      {
        method: 'POST',
        body: { signers: toRaw(signers.value) },
      },
    )

    router.push(`/admin/esign/${document.id}`)
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
  finally {
    submitting.value = false
  }
}

const saveDraft = async () => {
  submitting.value = true
  error.value = null

  try {
    const payload = buildPayload()

    const { document } = await authFetch(
      '/api/admin/esign/documents',
      { method: 'POST', body: payload },
    )

    router.push(`/admin/esign/${document.id}`)
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
  finally {
    submitting.value = false
  }
}

// Friendly field label from camelCase
const isFieldOptional = (field) => {
  const tmpl = selectedTemplate.value
  if (!tmpl?.optionalFields) return false
  const opt = JSON.parse(tmpl.optionalFields)
  return opt.includes(field)
}

const fieldLabel = field =>
  field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim()
</script>

<template>
  <div class="max-w-3xl">
    <h1
      class="text-2xl font-bold text-slate-800
        mb-6"
    >
      New Document
    </h1>

    <!-- Mode tabs -->
    <div
      class="flex gap-1 bg-slate-100 rounded-lg
        p-1 mb-6"
    >
      <button
        class="flex-1 py-2 px-4 rounded-md
          text-sm font-medium transition-colors"
        :class="mode === 'template'
          ? 'bg-white text-slate-800 shadow-sm'
          : 'text-slate-500 hover:text-slate-700'"
        @click="mode = 'template'"
      >
        From Template
      </button>
      <button
        class="flex-1 py-2 px-4 rounded-md
          text-sm font-medium transition-colors"
        :class="mode === 'adhoc'
          ? 'bg-white text-slate-800 shadow-sm'
          : 'text-slate-500 hover:text-slate-700'"
        @click="mode = 'adhoc'"
      >
        Ad Hoc
      </button>
    </div>

    <!-- Template mode -->
    <div
      v-if="mode === 'template'"
      class="space-y-4"
    >
      <!-- Template selector -->
      <div>
        <label
          class="block text-sm font-medium
            text-slate-700 mb-1"
        >
          Template
        </label>
        <select
          v-model="selectedTemplateId"
          class="w-full px-3 py-2 border
            border-slate-300 rounded-lg
            text-sm bg-white"
        >
          <option
            v-if="!templates.length"
            value=""
            disabled
          >
            No templates available
          </option>
          <option
            v-for="t in templates"
            :key="t.id"
            :value="t.id"
          >
            {{ t.name }}
          </option>
        </select>
        <p
          v-if="!templates.length"
          class="text-xs text-slate-500 mt-1"
        >
          Upload templates on the
          <NuxtLink
            to="/admin/esign/templates"
            class="text-[#1E3A5F] underline"
          >
            Templates page
          </NuxtLink>
        </p>
      </div>

      <!-- Lawmatics lookup -->
      <div
        class="bg-slate-50 border
          border-slate-200 rounded-lg p-4"
      >
        <p
          class="text-xs font-medium
            text-slate-500 mb-2"
        >
          Auto-fill from Lawmatics
        </p>
        <div class="flex gap-2">
          <input
            v-model="lmQuery"
            type="text"
            class="flex-1 px-3 py-2 border
              border-slate-300 rounded-lg
              text-sm"
            placeholder="Search by client name..."
            @keyup.enter="searchLawmatics"
          />
          <button
            :disabled="lmSearching
              || !lmQuery.trim()"
            class="px-4 py-2 bg-[#1E3A5F]
              text-white rounded-lg text-sm
              font-medium hover:bg-[#2a4d7a]
              transition-colors
              disabled:opacity-50"
            @click="searchLawmatics"
          >
            {{ lmSearching
              ? 'Searching...'
              : 'Search' }}
          </button>
        </div>

        <div
          v-if="lmLoading"
          class="mt-2 text-xs text-slate-500"
        >
          Loading matter details...
        </div>

        <div
          v-if="lmResults.length"
          class="mt-2 border border-slate-200
            rounded-lg overflow-hidden bg-white"
        >
          <button
            v-for="m in lmResults"
            :key="m.id"
            class="w-full text-left px-3 py-2
              text-sm hover:bg-slate-50
              border-b border-slate-100
              last:border-0 transition-colors"
            @click="selectMatter(m)"
          >
            <span class="font-medium">
              {{ m.name }}
            </span>
            <span
              v-if="m.caseTitle"
              class="text-slate-500 ml-2"
            >
              — {{ m.caseTitle }}
            </span>
            <span
              v-if="m.practiceArea"
              class="text-slate-400 ml-2
                text-xs"
            >
              {{ m.practiceArea }}
            </span>
          </button>
        </div>
      </div>

      <!-- Dynamic template fields -->
      <div
        v-if="templateFields.length"
        class="space-y-3"
      >
        <div
          v-for="field in templateFields"
          :key="field"
        >
          <label
            class="block text-xs font-medium
              mb-1"
            :class="isFieldOptional(field)
              ? 'text-slate-400'
              : 'text-slate-500'"
          >
            {{ fieldLabel(field) }}
            <span
              v-if="isFieldOptional(field)"
              class="text-slate-400 font-normal"
            >
              (optional)
            </span>
          </label>
          <input
            v-model="fieldValues[field]"
            type="text"
            class="w-full px-3 py-2 border
              border-slate-300 rounded-lg text-sm"
            :placeholder="fieldLabel(field)"
          />
        </div>
      </div>
    </div>

    <!-- Ad hoc mode -->
    <div
      v-if="mode === 'adhoc'"
      class="space-y-4"
    >
      <p class="text-sm text-slate-600">
        Set up your signers, upload a Word
        document, then place signature and
        date fields on the next screen.
      </p>

      <div>
        <label
          class="block text-sm font-medium
            text-slate-700 mb-1"
        >
          Document Title
        </label>
        <input
          v-model="adhocTitle"
          type="text"
          class="w-full px-3 py-2 border
            border-slate-300 rounded-lg text-sm"
          placeholder="Engagement Letter"
        />
      </div>

      <!-- Number of signers -->
      <div>
        <label
          class="block text-sm font-medium
            text-slate-700 mb-1"
        >
          Number of signers
        </label>
        <div class="flex gap-1">
          <button
            v-for="n in 6"
            :key="n"
            class="w-10 h-10 rounded-lg
              text-sm font-medium
              transition-colors"
            :class="adhocSignerCount === n
              ? 'bg-[#1E3A5F] text-white'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'"
            @click="adhocSignerCount = n"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <!-- Signer details -->
      <EsignSignerInputs />

      <div>
        <label
          class="block text-sm font-medium
            text-slate-700 mb-1"
        >
          Upload Word Document (.docx)
        </label>
        <input
          type="file"
          accept=".docx"
          class="w-full px-3 py-2 border
            border-slate-300 rounded-lg text-sm
            bg-white file:mr-3 file:py-1
            file:px-3 file:rounded-md
            file:border-0 file:text-sm
            file:font-medium
            file:bg-slate-100
            file:text-slate-700"
          @change="handleAdhocFileSelect"
        />
      </div>

      <button
        :disabled="!adhocFile || !adhocTitle
          || creatingAdhoc"
        class="px-6 py-2.5 rounded-lg text-sm
          font-medium text-white
          transition-colors"
        :class="adhocFile && adhocTitle
          ? 'bg-[#1E3A5F] hover:bg-[#2a4d7a]'
          : 'bg-slate-300 cursor-not-allowed'"
        @click="createAdhocDocument"
      >
        {{ creatingAdhoc
          ? 'Converting...'
          : 'Upload & Prepare Document' }}
      </button>
    </div>

    <!-- Signers (template mode) -->
    <div
      v-if="mode === 'template'"
      class="mt-8"
    >
      <EsignSignerInputs />
    </div>

    <!-- Error -->
    <p
      v-if="error"
      class="mt-4 text-sm text-red-600"
    >
      {{ error }}
    </p>

    <!-- Actions -->
    <div class="flex gap-3 mt-8">
      <button
        :disabled="!canSubmit"
        class="px-6 py-2.5 rounded-lg text-sm
          font-medium text-white
          transition-colors"
        :class="canSubmit
          ? 'bg-[#1E3A5F] hover:bg-[#2a4d7a]'
          : 'bg-slate-300 cursor-not-allowed'"
        @click="submit"
      >
        {{ submitting
          ? 'Sending...'
          : 'Create & Send' }}
      </button>
      <button
        :disabled="submitting"
        class="px-6 py-2.5 rounded-lg text-sm
          font-medium border border-slate-300
          text-slate-700 hover:bg-slate-50
          transition-colors"
        @click="saveDraft"
      >
        Save as Draft
      </button>
    </div>
  </div>
</template>
