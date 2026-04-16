<script setup>
const { authFetch } = useAdminAuth()

const documents = ref([])
const loading = ref(true)
const statusFilter = ref('')

const fetchDocuments = async () => {
  loading.value = true
  try {
    const params = statusFilter.value
      ? `?status=${statusFilter.value}`
      : ''
    const result = await authFetch(
      `/api/admin/esign/documents${params}`,
    )
    documents.value = result.documents
  }
  catch (err) {
    console.error('Failed to load documents:', err)
  }
  finally {
    loading.value = false
  }
}

onMounted(fetchDocuments)
watch(statusFilter, fetchDocuments)

const statusColors = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SENT: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  VOIDED: 'bg-red-100 text-red-700',
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
</script>

<template>
  <div>
    <div
      class="flex items-center justify-between
        mb-6"
    >
      <h1 class="text-2xl font-bold text-slate-800">
        Documents
      </h1>
      <NuxtLink
        to="/admin/esign/new"
        class="px-4 py-2 bg-[#1E3A5F] text-white
          rounded-lg text-sm font-medium
          hover:bg-[#2a4d7a] transition-colors"
      >
        New Document
      </NuxtLink>
    </div>

    <!-- Filter -->
    <div class="mb-4">
      <select
        v-model="statusFilter"
        class="px-3 py-2 border border-slate-300
          rounded-lg text-sm bg-white"
      >
        <option value="">
          All Statuses
        </option>
        <option value="DRAFT">
          Draft
        </option>
        <option value="SENT">
          Sent
        </option>
        <option value="COMPLETED">
          Completed
        </option>
        <option value="VOIDED">
          Voided
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="text-center py-12 text-slate-400"
    >
      Loading documents...
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!documents.length"
      class="text-center py-12"
    >
      <p class="text-slate-500 mb-4">
        No documents yet
      </p>
      <NuxtLink
        to="/admin/esign/new"
        class="text-[#1E3A5F] text-sm
          font-medium underline"
      >
        Create your first document
      </NuxtLink>
    </div>

    <!-- Document list -->
    <div
      v-else
      class="bg-white rounded-lg border
        border-slate-200 overflow-hidden"
    >
      <table class="w-full">
        <thead>
          <tr
            class="bg-slate-50 border-b
              border-slate-200"
          >
            <th
              class="text-left px-4 py-3
                text-xs font-medium
                text-slate-500 uppercase"
            >
              Title
            </th>
            <th
              class="text-left px-4 py-3
                text-xs font-medium
                text-slate-500 uppercase"
            >
              Type
            </th>
            <th
              class="text-left px-4 py-3
                text-xs font-medium
                text-slate-500 uppercase"
            >
              Status
            </th>
            <th
              class="text-left px-4 py-3
                text-xs font-medium
                text-slate-500 uppercase"
            >
              Created
            </th>
            <th
              class="text-right px-4 py-3
                text-xs font-medium
                text-slate-500 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="doc in documents"
            :key="doc.id"
            class="border-b border-slate-100
              hover:bg-slate-50
              transition-colors"
          >
            <td class="px-4 py-3">
              <NuxtLink
                :to="`/admin/esign/${doc.id}`"
                class="text-sm font-medium
                  text-slate-800 hover:text-[#1E3A5F]"
              >
                {{ doc.title }}
              </NuxtLink>
            </td>
            <td
              class="px-4 py-3 text-sm
                text-slate-500"
            >
              {{ doc.templateType ?? 'Ad Hoc' }}
            </td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded-full
                  text-xs font-medium"
                :class="statusColors[doc.status]"
              >
                {{ doc.status }}
              </span>
            </td>
            <td
              class="px-4 py-3 text-sm
                text-slate-500"
            >
              {{ formatDate(doc.createdAt) }}
            </td>
            <td class="px-4 py-3 text-right">
              <NuxtLink
                :to="`/admin/esign/${doc.id}`"
                class="text-xs text-[#1E3A5F]
                  hover:underline"
              >
                View
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
