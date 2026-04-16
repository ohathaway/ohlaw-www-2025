<script setup>
const props = defineProps({
  documentId: { type: String, required: true },
  label: { type: String, default: 'Preview PDF' },
})

const { getIdToken } = useAdminAuth()
const containerRef = ref(null)
const show = ref(false)

const {
  pages,
  loading,
  error,
  render,
} = usePdfViewer(containerRef)

const toggle = async () => {
  show.value = !show.value
  if (show.value) {
    await nextTick()
    const token = await getIdToken()
    render(
      `/api/admin/esign/documents/`
      + `${props.documentId}/preview-pdf`
      + `?token=${token}`,
    )
  }
}

defineExpose({ toggle, show })
</script>

<template>
  <div>
    <button
      class="px-4 py-2 bg-[#1E3A5F]
        text-white rounded-lg text-sm
        font-medium hover:bg-[#2a4d7a]
        transition-colors"
      @click="toggle"
    >
      {{ show ? 'Hide PDF' : label }}
    </button>

    <div
      v-if="show"
      class="bg-white rounded-lg border
        border-slate-200 mt-4"
    >
      <div
        class="px-4 py-3 border-b
          border-slate-200 flex items-center
          justify-between"
      >
        <h2
          class="text-sm font-semibold
            text-slate-700"
        >
          {{ label }}
        </h2>
        <button
          class="text-xs text-slate-500
            hover:text-slate-700"
          @click="show = false"
        >
          Close
        </button>
      </div>
      <div
        ref="containerRef"
        class="bg-slate-100 max-h-[70vh]
          overflow-y-auto"
      >
        <div
          v-if="loading"
          class="text-center py-12
            text-slate-400"
        >
          Loading PDF...
        </div>
        <div
          v-if="error"
          class="text-center py-12
            text-red-500 text-sm"
        >
          {{ error }}
        </div>
        <div
          class="flex flex-col items-center
            gap-4 p-4"
        >
          <canvas
            v-for="pageNum in pages"
            :key="pageNum"
            :data-page="pageNum"
            class="shadow-md bg-white
              max-w-full h-auto"
            style="width: 100%"
          />
        </div>
      </div>
    </div>
  </div>
</template>
