<script setup>
const props = defineProps({
  document: { type: Object, required: true },
  session: { type: Object, required: true },
  token: { type: String, required: true },
  fieldPlacements: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['signed', 'error'])

const termsAccepted = ref(false)
const submitting = ref(false)
const signed = ref(false)

// Field values keyed by placement id
const fieldValues = reactive({})
const signatureCanvases = ref({})

const hasPlacedFields = computed(() =>
  props.fieldPlacements.length > 0,
)

// Initialize field values
onMounted(() => {
  props.fieldPlacements.forEach((f) => {
    if (f.type === 'date_signed') {
      fieldValues[f.id] = new Date()
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
    }
    else if (f.type === 'name') {
      fieldValues[f.id]
        = props.session.signerName
    }
    else if (f.type === 'checkbox') {
      fieldValues[f.id] = false
    }
    else if (
      f.type === 'signature'
      || f.type === 'initials'
    ) {
      fieldValues[f.id] = null
    }
    else {
      fieldValues[f.id] = ''
    }
  })
})

// PDF viewer
const pdfContainerRef = ref(null)
const pdfUrl = computed(() =>
  `/api/esign/document-pdf/${props.token}`,
)
const {
  pages,
  loading: pdfLoading,
  error: pdfError,
  scrolledToBottom,
} = usePdfViewer(
  pdfContainerRef,
  pdfUrl,
  { autoRender: true },
)

// Page dimensions for coordinate mapping
const pageDims = ref({})

const capturePageDims = () => {
  const container = pdfContainerRef.value
  if (!container) return
  container.querySelectorAll(
    'canvas[data-page]',
  ).forEach((canvas) => {
    const page = parseInt(
      canvas.dataset.page, 10,
    )
    pageDims.value[page] = {
      width: canvas.width,
      height: canvas.height,
      displayWidth: canvas.offsetWidth,
      displayHeight: canvas.offsetHeight,
    }
  })
}

// Recapture after pages render
watch(pages, async () => {
  await nextTick()
  await nextTick()
  capturePageDims()
})

// Convert PDF coords to screen style
const fieldStyle = (field) => {
  const dims = pageDims.value[field.page]
  if (!dims) return { display: 'none' }

  const scaleX
    = dims.displayWidth / dims.width
  const scaleY
    = dims.displayHeight / dims.height

  return {
    position: 'absolute',
    left: `${field.x * scaleX}px`,
    top: `${
      (dims.height - field.y) * scaleY}px`,
    width: `${field.width * scaleX}px`,
    height: `${field.height * scaleY}px`,
  }
}

// Signature/initials canvas management
const setupSignatureCanvas = (
  el,
  fieldId,
  fieldType,
) => {
  if (!el) return

  signatureCanvases.value[fieldId] = el
  const ctx = el.getContext('2d')
  ctx.strokeStyle = '#000'
  ctx.lineWidth = fieldType === 'initials'
    ? 1.5
    : 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  let drawing = false
  let lastX = 0
  let lastY = 0

  const getCoords = (e) => {
    const rect = el.getBoundingClientRect()
    const scaleX = el.width / rect.width
    const scaleY = el.height / rect.height
    const cx = e.touches
      ? e.touches[0].clientX
      : e.clientX
    const cy = e.touches
      ? e.touches[0].clientY
      : e.clientY
    return {
      x: (cx - rect.left) * scaleX,
      y: (cy - rect.top) * scaleY,
    }
  }

  const start = (e) => {
    e.preventDefault()
    e.stopPropagation()
    drawing = true
    const { x, y } = getCoords(e)
    lastX = x
    lastY = y
  }

  const draw = (e) => {
    if (!drawing) return
    e.preventDefault()
    e.stopPropagation()
    const { x, y } = getCoords(e)
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()
    lastX = x
    lastY = y
    fieldValues[fieldId]
      = el.toDataURL('image/png')
  }

  const stop = () => {
    drawing = false
  }

  el.addEventListener('mousedown', start)
  el.addEventListener('mousemove', draw)
  el.addEventListener('mouseup', stop)
  el.addEventListener('mouseleave', stop)
  el.addEventListener(
    'touchstart', start, { passive: false },
  )
  el.addEventListener(
    'touchmove', draw, { passive: false },
  )
  el.addEventListener('touchend', stop)
}

const clearSignatureField = (fieldId) => {
  const el = signatureCanvases.value[fieldId]
  if (!el) return
  const ctx = el.getContext('2d')
  ctx.clearRect(0, 0, el.width, el.height)
  fieldValues[fieldId] = null
}

// Legacy signature pad (no placed fields)
const {
  canvasRef,
  hasSignature,
  clearSignature,
  getSignatureDataUrl,
} = useSignatureCanvas()

// Validation
const allFieldsFilled = computed(() => {
  if (!hasPlacedFields.value) return true

  return props.fieldPlacements.every((f) => {
    const val = fieldValues[f.id]
    if (f.type === 'date_signed') return true
    if (f.type === 'name') return true
    if (f.type === 'checkbox') return true
    if (
      f.type === 'signature'
      || f.type === 'initials'
    ) {
      return !!val
    }
    return !!val
  })
})

const canSubmit = computed(() => {
  if (!termsAccepted.value) return false
  if (submitting.value) return false
  if (!scrolledToBottom.value) return false

  if (hasPlacedFields.value) {
    return allFieldsFilled.value
  }

  return hasSignature.value
})

const submitSignature = async () => {
  if (!canSubmit.value) return
  submitting.value = true

  try {
    // Build field values for submission
    const submitValues = {}
    props.fieldPlacements.forEach((f) => {
      submitValues[f.id] = fieldValues[f.id]
    })

    // Get primary signature data
    const sigData = hasPlacedFields.value
      ? Object.entries(submitValues).find(
        ([id, val]) => {
          const f = props.fieldPlacements.find(
            p => p.id === id,
          )
          return f?.type === 'signature' && val
        },
      )?.[1]
      : getSignatureDataUrl()

    const result = await $fetch(
      `/api/esign/sign/${props.token}`,
      {
        method: 'POST',
        body: {
          signatureData: sigData,
          fieldValues: submitValues,
          termsAccepted: true,
        },
      },
    )

    signed.value = true
    emit('signed', result)
  }
  catch (err) {
    emit(
      'error',
      err.data?.message ?? err.message,
    )
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <!-- Success state -->
    <div
      v-if="signed"
      class="text-center py-16 px-8"
    >
      <div
        class="w-16 h-16 mx-auto mb-6
          rounded-full bg-green-100
          flex items-center justify-center"
      >
        <svg
          class="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2
        class="text-2xl font-bold
          text-slate-800 mb-2"
      >
        Document Signed
      </h2>
      <p class="text-slate-600">
        Thank you, {{ session.signerName }}.
        A confirmation email has been sent to
        {{ session.signerEmail }}.
      </p>
    </div>

    <!-- Signing ceremony -->
    <template v-else>
      <div class="mb-6">
        <h2
          class="text-xl font-bold
            text-slate-800 mb-1"
        >
          {{ document.title }}
        </h2>
        <p class="text-sm text-slate-500">
          Signing as {{ session.signerName }}
        </p>
      </div>

      <!-- PDF viewer with field overlays -->
      <div
        ref="pdfContainerRef"
        class="border border-slate-200 rounded-lg
          bg-slate-100 max-h-[60vh]
          overflow-y-auto mb-4"
      >
        <div
          v-if="pdfLoading"
          class="text-center py-12 text-slate-400"
        >
          Loading document...
        </div>

        <div
          v-if="pdfError"
          class="text-center py-12 text-red-500
            text-sm"
        >
          Failed to load document
        </div>

        <div
          class="flex flex-col items-center
            gap-4 p-4"
        >
          <div
            v-for="pageNum in pages"
            :key="pageNum"
            class="relative"
          >
            <canvas
              :data-page="pageNum"
              class="shadow-md bg-white
                max-w-full h-auto"
              style="width: 100%"
            />

            <!-- Field overlays for this page -->
            <template
              v-for="field in fieldPlacements
                .filter(
                  (f) => f.page === pageNum)"
              :key="field.id"
            >
              <!-- Signature / Initials -->
              <div
                v-if="field.type === 'signature'
                  || field.type === 'initials'"
                :style="fieldStyle(field)"
                class="absolute border-2
                  border-dashed border-blue-400
                  bg-blue-50/60 rounded
                  overflow-hidden"
              >
                <canvas
                  :ref="(el) =>
                    setupSignatureCanvas(
                      el, field.id, field.type)"
                  :width="field.width * 2"
                  :height="field.height * 2"
                  class="w-full h-full
                    cursor-crosshair touch-none"
                />
                <button
                  v-if="fieldValues[field.id]"
                  class="absolute top-0 right-0
                    text-[8px] text-blue-500
                    bg-white/80 px-1 rounded-bl"
                  @click="clearSignatureField(
                    field.id)"
                >
                  clear
                </button>
                <span
                  v-if="!fieldValues[field.id]"
                  class="absolute inset-0
                    flex items-center
                    justify-center text-[10px]
                    text-blue-400
                    pointer-events-none"
                >
                  {{ field.type === 'initials'
                    ? 'Initials'
                    : 'Sign here' }}
                </span>
              </div>

              <!-- Date Signed (auto) -->
              <div
                v-else-if="
                  field.type === 'date_signed'"
                :style="fieldStyle(field)"
                class="absolute flex items-center
                  px-1 bg-amber-50/80
                  border border-amber-300
                  rounded text-[10px]
                  text-slate-700"
              >
                {{ fieldValues[field.id] }}
              </div>

              <!-- Date (picker) -->
              <div
                v-else-if="field.type === 'date'"
                :style="fieldStyle(field)"
                class="absolute overflow-hidden"
              >
                <input
                  v-model="fieldValues[field.id]"
                  type="date"
                  class="w-full h-full px-1
                    border border-blue-300
                    rounded bg-blue-50/60
                    text-[10px] text-slate-700"
                />
              </div>

              <!-- Name (auto) -->
              <div
                v-else-if="field.type === 'name'"
                :style="fieldStyle(field)"
                class="absolute flex items-center
                  px-1 bg-amber-50/80
                  border border-amber-300
                  rounded text-[10px]
                  text-slate-700"
              >
                {{ fieldValues[field.id] }}
              </div>

              <!-- Text -->
              <div
                v-else-if="field.type === 'text'"
                :style="fieldStyle(field)"
                class="absolute overflow-hidden"
              >
                <input
                  v-model="fieldValues[field.id]"
                  type="text"
                  class="w-full h-full px-1
                    border border-blue-300
                    rounded bg-blue-50/60
                    text-[10px] text-slate-700"
                  :placeholder="field.label"
                />
              </div>

              <!-- Checkbox -->
              <div
                v-else-if="
                  field.type === 'checkbox'"
                :style="fieldStyle(field)"
                class="absolute flex items-center
                  justify-center"
              >
                <input
                  v-model="fieldValues[field.id]"
                  type="checkbox"
                  class="w-full h-full
                    cursor-pointer"
                />
              </div>
            </template>
          </div>
        </div>
      </div>

      <p
        v-if="!scrolledToBottom"
        class="text-sm text-amber-600 mb-4
          text-center"
      >
        Please scroll to the bottom of the
        document to continue
      </p>

      <!-- ESIGN disclosure -->
      <div
        class="bg-slate-50 border
          border-slate-200 rounded-lg p-4
          mb-4 text-sm text-slate-600"
      >
        <p class="font-medium text-slate-700 mb-2">
          Electronic Signature Disclosure
        </p>
        <p>
          By signing this document electronically,
          you consent to the use of electronic
          records and signatures pursuant to the
          Electronic Signatures in Global and
          National Commerce Act (ESIGN) and the
          Uniform Electronic Transactions Act
          (UETA). Your electronic signature has
          the same legal force and effect as a
          handwritten signature.
        </p>
      </div>

      <!-- Terms checkbox -->
      <label
        class="flex items-start gap-3 mb-6
          cursor-pointer"
      >
        <input
          v-model="termsAccepted"
          type="checkbox"
          class="mt-1 w-4 h-4 rounded
            border-slate-300"
        />
        <span class="text-sm text-slate-700">
          I agree to use electronic records and
          signatures and acknowledge that my
          electronic signature is legally binding.
        </span>
      </label>

      <!-- Legacy signature pad (no placed fields) -->
      <div
        v-if="!hasPlacedFields"
        class="mb-6"
      >
        <div
          class="flex items-center
            justify-between mb-2"
        >
          <span
            class="text-sm font-medium
              text-slate-700"
          >
            Draw your signature below
          </span>
          <button
            class="text-xs text-slate-500
              hover:text-slate-700 underline"
            @click="clearSignature"
          >
            Clear
          </button>
        </div>
        <div
          class="border-2 border-dashed
            border-slate-300 rounded-lg bg-white"
          :class="{
            'border-blue-400': hasSignature,
          }"
        >
          <canvas
            ref="canvasRef"
            width="600"
            height="150"
            class="w-full h-[150px]
              cursor-crosshair touch-none"
          />
        </div>
      </div>

      <!-- Submit -->
      <button
        :disabled="!canSubmit"
        class="w-full py-3 px-6 rounded-lg
          font-medium text-white
          transition-colors"
        :class="canSubmit
          ? 'bg-[#1E3A5F] hover:bg-[#2a4d7a]'
          : 'bg-slate-300 cursor-not-allowed'"
        @click="submitSignature"
      >
        {{ submitting
          ? 'Submitting...'
          : 'Sign Document' }}
      </button>
    </template>
  </div>
</template>
