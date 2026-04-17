<script setup>
const { authFetch } = useAdminAuth()

const templates = ref([])
const loading = ref(true)
const uploading = ref(false)
const error = ref(null)

// Upload form
const templateName = ref('')
const templateDesc = ref('')
const selectedFile = ref(null)

const fetchTemplates = async () => {
  loading.value = true
  try {
    const result = await authFetch(
      '/api/admin/esign/templates',
    )
    templates.value = result.templates
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
    console.error('Failed to load templates:', err)
  }
  finally {
    loading.value = false
  }
}

onMounted(fetchTemplates)

const handleFileSelect = (event) => {
  selectedFile.value
    = event.target.files?.[0] ?? null
  if (
    selectedFile.value
    && !templateName.value
  ) {
    templateName.value
      = selectedFile.value.name
        .replace(/\.docx$/i, '')
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  error.value = null

  try {
    // Convert file to base64 in chunks
    const fileBuffer = await selectedFile.value
      .arrayBuffer()
    const bytes = new Uint8Array(fileBuffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    const fileBase64 = btoa(binary)

    const { template } = await authFetch(
      '/api/admin/esign/templates',
      {
        method: 'POST',
        body: {
          name: templateName.value,
          description: templateDesc.value,
          fileName: selectedFile.value.name,
          fileBase64,
        },
      },
    )

    // Reset form
    templateName.value = ''
    templateDesc.value = ''
    selectedFile.value = null
    lastUploadedId.value = template.id

    await fetchTemplates()
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
  finally {
    uploading.value = false
  }
}

const lastUploadedId = ref(null)

const handleDelete = async (id) => {
  if (
    !confirm('Delete this template?')
  ) return

  try {
    await authFetch(
      `/api/admin/esign/templates/${id}`,
      { method: 'DELETE' },
    )
    await fetchTemplates()
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
}

const parseFields = (fieldsJson) => {
  try {
    return JSON.parse(fieldsJson)
  }
  catch {
    return []
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return '—'
  const d = new Date(
    typeof timestamp === 'number'
      ? timestamp * 1000
      : timestamp,
  )
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Lawmatics field options for mapping
const LM_FIELDS = [
  { value: '', label: '— Not mapped —' },
  { value: 'clientName', label: 'Client Name (full)' },
  { value: 'firstName', label: 'First Name' },
  { value: 'middleName', label: 'Middle Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'clientLastName', label: 'Client Last Name' },
  { value: 'clientPrefix', label: 'Prefix (Mr/Mrs)' },
  { value: 'nameSuffix', label: 'Suffix (Jr/Sr/III)' },
  { value: 'clientAddress', label: 'Client Address (full)' },
  { value: 'street', label: 'Street' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'zipcode', label: 'Zip Code' },
  { value: 'cityStateZip', label: 'City, State Zip' },
  { value: 'clientEmail', label: 'Client Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'attorneyFee', label: 'Attorney Fee' },
  { value: 'caseTitle', label: 'Case Title' },
  { value: 'caseNumber', label: 'Case Number' },
  { value: 'birthdate', label: 'Birthdate' },
  { value: 'maritalStatus', label: 'Marital Status' },
  { value: 'date', label: 'Today\'s Date' },
  { value: 'jointClientName', label: 'Spouse Name (full)' },
  { value: 'jointFirstName', label: 'Spouse First Name' },
  { value: 'jointMiddleName', label: 'Spouse Middle Name' },
  { value: 'jointLastName', label: 'Spouse Last Name' },
  { value: 'jointClientPrefix', label: 'Spouse Prefix' },
  { value: 'jointNameSuffix', label: 'Spouse Suffix' },
  { value: 'jointClientEmail', label: 'Spouse Email' },
]

// Editing mappings + optional fields
const editingId = ref(null)
const editMappings = ref({})
const editOptional = ref({})
const savingMappings = ref(false)

const parseOptional = (tmpl) => {
  try {
    return new Set(
      JSON.parse(tmpl.optionalFields ?? '[]'),
    )
  }
  catch { return new Set() }
}

const startEditMappings = (tmpl) => {
  editingId.value = tmpl.id
  const existing = tmpl.fieldMappings
    ? JSON.parse(tmpl.fieldMappings)
    : {}
  const optSet = parseOptional(tmpl)
  const fields = parseFields(tmpl.fields)
  editMappings.value = {}
  editOptional.value = {}
  fields.forEach((f) => {
    editMappings.value[f] = existing[f] ?? ''
    editOptional.value[f] = optSet.has(f)
  })
}

const cancelEditMappings = () => {
  editingId.value = null
  editMappings.value = {}
}

const saveMappings = async (id) => {
  savingMappings.value = true
  try {
    await authFetch(
      `/api/admin/esign/templates/${id}`,
      {
        method: 'PUT',
        body: {
          fieldMappings: editMappings.value,
          optionalFields: Object.entries(
            editOptional.value,
          ).filter(([, v]) => v)
            .map(([k]) => k),
        },
      },
    )
    editingId.value = null
    await fetchTemplates()
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
  finally {
    savingMappings.value = false
  }
}
</script>

<template>
  <div>
    <h1
      class="text-2xl font-bold text-slate-800
        mb-6"
    >
      Document Templates
    </h1>

    <!-- Upload form -->
    <div
      class="bg-white rounded-lg border
        border-slate-200 p-6 mb-6"
    >
      <h2
        class="text-sm font-semibold
          text-slate-700 mb-4"
      >
        Upload New Template
      </h2>
      <p class="text-xs text-slate-500 mb-4">
        Upload a .docx file with
        <code
          class="bg-slate-100 px-1 rounded"
          v-text="'{{fieldName}}'"
        />
        placeholders. Fields are detected
        automatically.
      </p>

      <div class="space-y-3">
        <div class="flex gap-3">
          <div class="flex-1">
            <input
              v-model="templateName"
              type="text"
              class="w-full px-3 py-2 border
                border-slate-300 rounded-lg
                text-sm"
              placeholder="Template name"
            />
          </div>
          <div class="flex-1">
            <input
              v-model="templateDesc"
              type="text"
              class="w-full px-3 py-2 border
                border-slate-300 rounded-lg
                text-sm"
              placeholder="Description (optional)"
            />
          </div>
        </div>

        <div class="flex gap-3 items-end">
          <div class="flex-1">
            <input
              type="file"
              accept=".docx"
              class="w-full px-3 py-2 border
                border-slate-300 rounded-lg
                text-sm bg-white
                file:mr-3 file:py-1
                file:px-3 file:rounded-md
                file:border-0 file:text-sm
                file:font-medium
                file:bg-slate-100
                file:text-slate-700"
              @change="handleFileSelect"
            />
          </div>
          <button
            :disabled="!selectedFile || uploading"
            class="px-4 py-2 bg-[#1E3A5F]
              text-white rounded-lg text-sm
              font-medium hover:bg-[#2a4d7a]
              transition-colors
              disabled:opacity-50"
            @click="handleUpload"
          >
            {{ uploading
              ? 'Uploading...'
              : 'Upload' }}
          </button>
        </div>
      </div>

      <!-- Success banner -->
      <div
        v-if="lastUploadedId"
        class="mt-3 bg-green-50 border
          border-green-200 rounded-lg p-4
          flex items-center justify-between"
      >
        <p class="text-sm text-green-800">
          Template uploaded successfully
        </p>
        <div class="flex gap-2">
          <NuxtLink
            :to="`/admin/esign/new?templateId=${
              lastUploadedId}`"
            class="px-3 py-1.5 bg-[#1E3A5F]
              text-white rounded-lg text-xs
              font-medium hover:bg-[#2a4d7a]
              transition-colors"
          >
            Use This Template
          </NuxtLink>
          <button
            class="px-3 py-1.5 border
              border-slate-300 rounded-lg
              text-xs font-medium text-slate-700
              hover:bg-slate-50
              transition-colors"
            @click="lastUploadedId = null"
          >
            Dismiss
          </button>
        </div>
      </div>

      <p
        v-if="error"
        class="mt-3 text-sm text-red-600"
      >
        {{ error }}
      </p>
    </div>

    <!-- Templates list -->
    <div
      v-if="loading"
      class="text-center py-12 text-slate-400"
    >
      Loading templates...
    </div>

    <div
      v-else-if="!templates.length"
      class="text-center py-12 text-slate-500"
    >
      No templates yet. Upload a .docx file
      to get started.
    </div>

    <div
      v-else
      class="space-y-3"
    >
      <div
        v-for="tmpl in templates"
        :key="tmpl.id"
        class="bg-white rounded-lg border
          border-slate-200 p-4"
      >
        <div
          class="flex items-start
            justify-between"
        >
          <div>
            <h3
              class="text-sm font-semibold
                text-slate-800"
            >
              {{ tmpl.name }}
            </h3>
            <p
              v-if="tmpl.description"
              class="text-xs text-slate-500 mt-1"
            >
              {{ tmpl.description }}
            </p>
            <p class="text-xs text-slate-400 mt-1">
              Created {{ formatDate(
                tmpl.createdAt) }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <NuxtLink
              :to="`/admin/esign/new?templateId=${
                tmpl.id}`"
              class="text-xs text-[#1E3A5F]
                hover:underline"
            >
              Use Template
            </NuxtLink>
            <button
              class="text-xs text-red-500
                hover:underline"
              @click="handleDelete(tmpl.id)"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Field tags + mapping toggle -->
        <div
          v-if="parseFields(tmpl.fields).length"
          class="mt-3"
        >
          <div
            class="flex items-center
              justify-between mb-2"
          >
            <div class="flex flex-wrap gap-1">
              <span
                v-for="field in parseFields(
                  tmpl.fields)"
                :key="field"
                class="px-2 py-0.5 text-xs
                  rounded-full"
                :class="tmpl.fieldMappings
                  && JSON.parse(
                    tmpl.fieldMappings,
                  )[field]
                  ? 'bg-green-100 text-green-700'
                  : parseOptional(tmpl).has(field)
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-slate-100 text-slate-600'"
              >
                {{ field }}
                <span
                  v-if="parseOptional(tmpl)
                    .has(field)"
                  class="text-[10px] opacity-70"
                >
                  (opt)
                </span>
              </span>
            </div>
            <button
              v-if="editingId !== tmpl.id"
              class="text-xs text-[#1E3A5F]
                hover:underline ml-3
                whitespace-nowrap"
              @click="startEditMappings(tmpl)"
            >
              Map Fields
            </button>
          </div>

          <!-- Mapping editor -->
          <div
            v-if="editingId === tmpl.id"
            class="bg-slate-50 rounded-lg
              p-3 space-y-2"
          >
            <p
              class="text-xs font-medium
                text-slate-500 mb-2"
            >
              Map placeholders to Lawmatics
              fields
            </p>
            <div
              v-for="field in parseFields(
                tmpl.fields)"
              :key="field"
              class="flex items-center gap-3"
            >
              <span
                class="text-xs font-mono
                  text-slate-600 w-36
                  truncate"
              >
                {{ field }}
              </span>
              <span
                class="text-xs text-slate-400"
              >
                →
              </span>
              <select
                v-model="editMappings[field]"
                class="flex-1 px-2 py-1 border
                  border-slate-300 rounded
                  text-xs bg-white"
              >
                <option
                  v-for="opt in LM_FIELDS"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
              <label
                class="flex items-center gap-1
                  text-xs text-slate-500
                  whitespace-nowrap
                  cursor-pointer"
              >
                <input
                  v-model="editOptional[field]"
                  type="checkbox"
                  class="w-3.5 h-3.5 rounded
                    border-slate-300"
                />
                Optional
              </label>
            </div>
            <div class="flex gap-2 mt-3">
              <button
                :disabled="savingMappings"
                class="px-3 py-1.5 bg-[#1E3A5F]
                  text-white rounded text-xs
                  font-medium hover:bg-[#2a4d7a]
                  disabled:opacity-50"
                @click="saveMappings(tmpl.id)"
              >
                {{ savingMappings
                  ? 'Saving...'
                  : 'Save Mappings' }}
              </button>
              <button
                class="px-3 py-1.5 border
                  border-slate-300 rounded
                  text-xs text-slate-700
                  hover:bg-slate-50"
                @click="cancelEditMappings"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
