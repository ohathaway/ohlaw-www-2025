<script setup>
const route = useRoute()
const router = useRouter()
const { authFetch, getIdToken } = useAdminAuth()

const docId = route.params.id
const document = ref(null)
const loading = ref(true)
const saving = ref(false)
const error = ref(null)

// Field placements
const placements = ref([])
let nextFieldId = 1

// PDF viewer
const pdfContainerRef = ref(null)
const pdfPages = ref([])
const pdfScale = ref(1.5)
const pageHeights = ref({})

const {
  pages,
  loading: pdfLoading,
  error: pdfError,
  render: renderPdf,
} = usePdfViewer(pdfContainerRef)

// Load document
onMounted(async () => {
  try {
    const result = await authFetch(
      `/api/admin/esign/documents/${docId}`,
    )
    document.value = result.document

    // Load existing placements, filtering out
    // any assigned to signers beyond the count
    if (result.document.fieldPlacements) {
      const count
        = result.document.signerCount ?? 1
      const existing = JSON.parse(
        result.document.fieldPlacements,
      ).filter(
        f => Number(f.signerRole) <= count,
      )
      placements.value = existing
      nextFieldId = existing.reduce(
        (max, f) => {
          const num = parseInt(
            f.id?.replace('f', ''), 10,
          ) || 0
          return Math.max(max, num + 1)
        },
        1,
      )
    }

    // Render PDF
    await nextTick()
    const token = await getIdToken()
    await renderPdf(
      `/api/admin/esign/documents/`
      + `${docId}/preview-pdf`
      + `?token=${token}`,
    )

    // Capture page dimensions after render
    await nextTick()
    capturePageDimensions()
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
  finally {
    loading.value = false
  }
})

const capturePageDimensions = () => {
  const container = pdfContainerRef.value
  if (!container) return

  const canvases = container.querySelectorAll(
    'canvas[data-page]',
  )
  canvases.forEach((canvas) => {
    const page = parseInt(
      canvas.dataset.page, 10,
    )
    pageHeights.value[page] = {
      width: canvas.width,
      height: canvas.height,
      displayWidth: canvas.offsetWidth,
      displayHeight: canvas.offsetHeight,
    }
  })
}

// Field type definitions
const FIELD_TYPES = [
  {
    type: 'signature',
    label: 'Signature',
    icon: 'bi-pen',
    defaultW: 200,
    defaultH: 50,
  },
  {
    type: 'initials',
    label: 'Initials',
    icon: 'bi-pencil',
    defaultW: 80,
    defaultH: 40,
  },
  {
    type: 'date_signed',
    label: 'Date Signed',
    icon: 'bi-calendar-check',
    defaultW: 120,
    defaultH: 20,
  },
  {
    type: 'date',
    label: 'Date',
    icon: 'bi-calendar',
    defaultW: 120,
    defaultH: 20,
  },
  {
    type: 'name',
    label: 'Name',
    icon: 'bi-person',
    defaultW: 150,
    defaultH: 20,
  },
  {
    type: 'text',
    label: 'Text',
    icon: 'bi-fonts',
    defaultW: 200,
    defaultH: 20,
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'bi-check-square',
    defaultW: 16,
    defaultH: 16,
  },
]

// Active signer number for new fields
const activeSigner = ref(1)
const draftStore = useEsignDraftStore()
const { signers: draftSigners }
  = storeToRefs(draftStore)

// Signer count: store (live) → document record
const signerCount = computed(() => {
  if (draftSigners.value.length > 1) {
    return draftSigners.value.length
  }
  return document.value?.signerCount ?? 1
})
const isMultiSigner = computed(() =>
  signerCount.value >= 2,
)

const SIGNER_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
]

const SIGNER_BORDER_COLORS = [
  'border-blue-400 bg-blue-50/80',
  'border-green-400 bg-green-50/80',
  'border-purple-400 bg-purple-50/80',
  'border-orange-400 bg-orange-50/80',
  'border-pink-400 bg-pink-50/80',
  'border-teal-400 bg-teal-50/80',
]

const signerBgClass = num =>
  SIGNER_COLORS[(num - 1) % SIGNER_COLORS.length]

const signerBorderClass = num =>
  SIGNER_BORDER_COLORS[
    (num - 1) % SIGNER_BORDER_COLORS.length
  ]

// Add a field to a page
const addField = (fieldType, pageNum) => {
  const dims = pageHeights.value[pageNum]
  if (!dims) return

  // Place in center of visible area
  const scale = dims.displayWidth / dims.width
  const pdfW = fieldType.defaultW
  const pdfH = fieldType.defaultH
  const pdfX = (dims.width / 2 - pdfW) / 2
  const pdfY = dims.height / 2

  placements.value.push({
    id: `f${nextFieldId++}`,
    page: pageNum,
    x: Math.round(pdfX),
    y: Math.round(pdfY),
    width: pdfW,
    height: pdfH,
    type: fieldType.type,
    signerRole: activeSigner.value,
    label: fieldType.label,
  })
}

// Drop handler for toolbar drag
const onDrop = (event, pageNum) => {
  const typeStr = event.dataTransfer
    ?.getData('fieldType')
  if (!typeStr) return

  const fieldType = FIELD_TYPES.find(
    f => f.type === typeStr,
  )
  if (!fieldType) return

  const dims = pageHeights.value[pageNum]
  if (!dims) return

  const canvas = pdfContainerRef.value
    ?.querySelector(
      `canvas[data-page="${pageNum}"]`,
    )
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const scale = dims.width / rect.width

  // Convert drop position to PDF coordinates
  const screenX = event.clientX - rect.left
  const screenY = event.clientY - rect.top
  const pdfX = screenX * scale
  // PDF Y is from bottom
  const pdfY = dims.height - (screenY * scale)

  placements.value.push({
    id: `f${nextFieldId++}`,
    page: pageNum,
    x: Math.round(pdfX),
    y: Math.round(pdfY),
    width: fieldType.defaultW,
    height: fieldType.defaultH,
    type: fieldType.type,
    signerRole: activeSigner.value,
    label: fieldType.label,
  })
}

const onDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

const onToolbarDragStart = (event, fieldType) => {
  event.dataTransfer.setData(
    'fieldType',
    fieldType.type,
  )
  event.dataTransfer.effectAllowed = 'copy'
}

// Field dragging within a page
const dragState = ref(null)

const startFieldDrag = (event, field) => {
  const canvas = pdfContainerRef.value
    ?.querySelector(
      `canvas[data-page="${field.page}"]`,
    )
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const dims = pageHeights.value[field.page]
  const scale = dims.width / rect.width

  dragState.value = {
    fieldId: field.id,
    startScreenX: event.clientX,
    startScreenY: event.clientY,
    startPdfX: field.x,
    startPdfY: field.y,
    scale,
    pageHeight: dims.height,
    canvasRect: rect,
  }

  const onMove = (e) => {
    if (!dragState.value) return
    const dx
      = (e.clientX - dragState.value.startScreenX)
        * dragState.value.scale
    const dy
      = (e.clientY - dragState.value.startScreenY)
        * dragState.value.scale

    const f = placements.value.find(
      p => p.id === dragState.value.fieldId,
    )
    if (f) {
      f.x = Math.round(
        dragState.value.startPdfX + dx,
      )
      // Y is inverted (PDF bottom-left origin)
      f.y = Math.round(
        dragState.value.startPdfY - dy,
      )
    }
  }

  const onUp = () => {
    dragState.value = null
    window.removeEventListener(
      'mousemove', onMove,
    )
    window.removeEventListener(
      'mouseup', onUp,
    )
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

const removeField = (id) => {
  placements.value = placements.value.filter(
    f => f.id !== id,
  )
}

const selectedField = ref(null)

const selectField = (field) => {
  selectedField.value = field
}

// Convert PDF coords to screen position
// for overlay rendering
const fieldStyle = (field) => {
  const dims = pageHeights.value[field.page]
  if (!dims) return { display: 'none' }

  const scaleX = dims.displayWidth / dims.width
  const scaleY
    = dims.displayHeight / dims.height

  const left = field.x * scaleX
  // PDF Y is from bottom, screen Y from top
  const top
    = (dims.height - field.y) * scaleY
  const width = field.width * scaleX
  const height = field.height * scaleY

  return {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  }
}

const roleColor = role =>
  signerBorderClass(
    typeof role === 'number' ? role : 1,
  )

// Validate: every signer has at least one
// signature field
const validatePlacements = () => {
  const count = signerCount.value
  for (let n = 1; n <= count; n++) {
    const hasSig = placements.value.some(
      f => Number(f.signerRole) === n
        && f.type === 'signature',
    )
    if (!hasSig) {
      error.value
        = `Signer ${n} needs at least one `
          + `signature field`
      return false
    }
  }
  return true
}

// Save
const savePlacements = async () => {
  error.value = null
  if (!validatePlacements()) return

  saving.value = true
  try {
    await authFetch(
      `/api/admin/esign/documents/`
      + `${docId}/placements`,
      {
        method: 'PUT',
        body: { placements: placements.value },
      },
    )
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
  finally {
    saving.value = false
  }
}

const saveAndSend = async () => {
  await savePlacements()
  if (error.value) return
  router.push(`/admin/esign/${docId}`)
}

const updateSignerCount = async (count) => {
  try {
    await authFetch(
      `/api/admin/esign/documents/`
      + `${docId}/signer-count`,
      {
        method: 'PUT',
        body: { signerCount: count },
      },
    )
    document.value.signerCount = count
    // Remove placements for removed signers
    placements.value = placements.value.filter(
      f => Number(f.signerRole) <= count,
    )
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-4rem)]">
    <!-- Header -->
    <div
      class="flex items-center justify-between
        px-4 py-3 border-b border-slate-200
        bg-white shrink-0"
    >
      <div>
        <NuxtLink
          :to="`/admin/esign/${docId}`"
          class="text-xs text-slate-500
            hover:text-slate-700"
        >
          &larr; Back
        </NuxtLink>
        <h1
          class="text-lg font-bold
            text-slate-800"
        >
          Prepare Document
        </h1>
      </div>
      <div class="flex gap-2">
        <button
          :disabled="saving"
          class="px-4 py-2 border
            border-slate-300 rounded-lg
            text-sm font-medium text-slate-700
            hover:bg-slate-50
            disabled:opacity-50"
          @click="savePlacements"
        >
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <button
          :disabled="saving
            || !placements.length"
          class="px-4 py-2 bg-[#1E3A5F]
            text-white rounded-lg text-sm
            font-medium hover:bg-[#2a4d7a]
            disabled:opacity-50"
          @click="saveAndSend"
        >
          Done
        </button>
      </div>
    </div>

    <p
      v-if="error"
      class="px-4 py-2 text-sm text-red-600
        bg-red-50"
    >
      {{ error }}
    </p>

    <div class="flex flex-1 overflow-hidden">
      <!-- Toolbar -->
      <div
        class="w-48 bg-slate-50 border-r
          border-slate-200 p-3 shrink-0
          overflow-y-auto"
      >
        <!-- Signer count -->
        <p
          class="text-xs font-semibold
            text-slate-500 mb-2 uppercase
            tracking-wide"
        >
          Signers
        </p>
        <div class="flex gap-1 mb-4">
          <button
            v-for="n in 6"
            :key="n"
            class="w-7 h-7 rounded text-[10px]
              font-bold transition-colors"
            :class="signerCount === n
              ? 'bg-[#1E3A5F] text-white'
              : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'"
            @click="updateSignerCount(n)"
          >
            {{ n }}
          </button>
        </div>

        <!-- Signer toggle (multi-signer only) -->
        <div
          v-if="isMultiSigner"
          class="mb-4"
        >
          <p
            class="text-xs font-semibold
              text-slate-500 mb-2 uppercase
              tracking-wide"
          >
            Placing for Signer
          </p>
          <div class="flex gap-1 flex-wrap">
            <button
              v-for="n in signerCount"
              :key="n"
              class="w-8 h-8 rounded-md
                text-xs font-bold
                transition-colors"
              :class="activeSigner === n
                ? signerBgClass(n) + ' text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
              @click="activeSigner = n"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <p
          class="text-xs font-semibold
            text-slate-500 mb-2 uppercase
            tracking-wide"
        >
          Fields
        </p>
        <div class="space-y-1">
          <div
            v-for="ft in FIELD_TYPES"
            :key="ft.type"
            draggable="true"
            class="flex items-center gap-2
              px-3 py-2 rounded-lg
              bg-white border border-slate-200
              text-sm text-slate-700
              cursor-grab hover:border-blue-300
              hover:bg-blue-50/50
              active:cursor-grabbing
              transition-colors"
            @dragstart="
              onToolbarDragStart($event, ft)"
          >
            <i :class="['bi', ft.icon]" />
            {{ ft.label }}
          </div>
        </div>

        <!-- Selected field properties -->
        <div
          v-if="selectedField"
          class="mt-6"
        >
          <p
            class="text-xs font-semibold
              text-slate-500 mb-2 uppercase
              tracking-wide"
          >
            Properties
          </p>
          <div class="space-y-2">
            <div>
              <label
                class="block text-xs
                  text-slate-500 mb-1"
              >
                Label
              </label>
              <input
                v-model="selectedField.label"
                type="text"
                class="w-full px-2 py-1 border
                  border-slate-300 rounded
                  text-xs"
              />
            </div>
            <div>
              <label
                class="block text-xs
                  text-slate-500 mb-1"
              >
                Signer
              </label>
              <select
                v-model="
                  selectedField.signerRole"
                class="w-full px-2 py-1 border
                  border-slate-300 rounded
                  text-xs bg-white"
              >
                <option
                  v-for="n in signerCount"
                  :key="n"
                  :value="n"
                >
                  Signer {{ n }}
                </option>
              </select>
            </div>
            <button
              class="text-xs text-red-500
                hover:underline"
              @click="removeField(
                        selectedField.id);
                      selectedField = null"
            >
              Remove Field
            </button>
          </div>
        </div>

        <div class="mt-6">
          <p
            class="text-xs text-slate-400"
          >
            Drag fields onto the document
            pages, or click a page to add.
          </p>
        </div>
      </div>

      <!-- PDF pages with overlays -->
      <div
        ref="pdfContainerRef"
        class="flex-1 overflow-y-auto
          bg-slate-200 p-6"
      >
        <div
          v-if="pdfLoading"
          class="text-center py-12
            text-slate-400"
        >
          Loading document...
        </div>

        <div
          class="flex flex-col items-center
            gap-6"
        >
          <div
            v-for="pageNum in pages"
            :key="pageNum"
            class="relative"
            @drop="onDrop($event, pageNum)"
            @dragover="onDragOver"
          >
            <!-- PDF canvas -->
            <canvas
              :data-page="pageNum"
              class="shadow-lg bg-white"
              :style="{ maxWidth: '100%' }"
            />

            <!-- Field overlays -->
            <div
              v-for="field in placements.filter(
                (f) => f.page === pageNum)"
              :key="field.id"
              :style="fieldStyle(field)"
              class="absolute border-2
                rounded cursor-move
                flex items-center justify-center
                text-[10px] font-medium
                select-none"
              :class="[
                roleColor(field.signerRole),
                selectedField?.id === field.id
                  ? 'ring-2 ring-blue-500'
                  : '',
              ]"
              @mousedown.prevent="
                selectField(field);
                startFieldDrag($event, field)"
            >
              <span class="truncate px-1">
                {{ field.label }}
              </span>
              <span
                class="absolute -top-2 -right-2
                  w-4 h-4 rounded-full
                  text-[9px] font-bold
                  leading-none shadow-sm
                  flex items-center
                  justify-center text-white"
                :class="signerBgClass(
                  field.signerRole)"
              >
                {{ field.signerRole }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
