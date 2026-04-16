<script setup>
const props = defineProps({
  documentId: { type: String, required: true },
  signerCount: { type: Number, default: 1 },
  initialSigners: {
    type: Array,
    default: null,
  },
})

const emit = defineEmits(['sent'])

const { authFetch } = useAdminAuth()
const draftStore = useEsignDraftStore()
const { signers } = storeToRefs(draftStore)
const sending = ref(false)
const error = ref(null)

// Initialize signers from: store (navigation)
// → prop (document record) → count
onMounted(() => {
  const hasStoreData
    = draftStore.documentId === props.documentId
      && signers.value.some(
        s => s.name || s.email,
      )

  if (hasStoreData) return

  if (props.initialSigners?.length) {
    draftStore.setSigners(
      [...props.initialSigners],
    )
    draftStore.setDocumentId(props.documentId)
  }
  else {
    draftStore.setSignerCount(props.signerCount)
  }
})

const canSend = computed(() =>
  signers.value.every(
    s => s.name && s.email,
  ) && !sending.value,
)

const handleSend = async () => {
  if (!canSend.value) return
  sending.value = true
  error.value = null

  try {
    await authFetch(
      `/api/admin/esign/documents/`
      + `${props.documentId}/send`,
      {
        method: 'POST',
        body: {
          signers: toRaw(signers.value),
        },
      },
    )
    draftStore.clear()
    emit('sent')
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
  finally {
    sending.value = false
  }
}
</script>

<template>
  <div
    class="bg-white rounded-lg border
      border-slate-200 p-6"
  >
    <h2
      class="text-sm font-semibold
        text-slate-700 mb-4"
    >
      Send for Signature
    </h2>

    <EsignSignerInputs />

    <button
      :disabled="!canSend"
      class="mt-4 px-6 py-2.5 rounded-lg
        text-sm font-medium text-white
        transition-colors"
      :class="canSend
        ? 'bg-[#1E3A5F] hover:bg-[#2a4d7a]'
        : 'bg-slate-300 cursor-not-allowed'"
      @click="handleSend"
    >
      {{ sending
        ? 'Sending...'
        : 'Send for Signature' }}
    </button>

    <p
      v-if="error"
      class="mt-3 text-sm text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>
