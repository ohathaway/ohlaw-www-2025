<script setup>
definePageMeta({ layout: false })

const route = useRoute()
const token = route.params.token

const { data, error, status } = await useFetch(
  `/api/esign/session/${token}`,
)

const signingError = ref(null)

const onSigned = (result) => {
  console.info('Signed:', result.certificateId)
}

const onError = (message) => {
  signingError.value = message
}

const errorTitle = computed(() => {
  if (!error.value) return ''
  const code = error.value.statusCode
  if (code === 404) return 'Link Not Found'
  if (code === 410) return 'Link Expired'
  return 'Something Went Wrong'
})

const errorMessage = computed(() =>
  error.value?.data?.message
  ?? error.value?.statusMessage
  ?? 'Unable to load this signing page.',
)
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header
      class="bg-white border-b border-slate-200
        px-6 py-4"
    >
      <div class="max-w-3xl mx-auto">
        <span
          class="text-lg font-bold
            text-[#1E3A5F]"
        >
          The Law Offices of Owen Hathaway
        </span>
      </div>
    </header>

    <main class="px-6 py-8">
      <!-- Loading -->
      <div
        v-if="status === 'pending'"
        class="max-w-3xl mx-auto text-center
          py-16 text-slate-400"
      >
        Loading document...
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="max-w-md mx-auto text-center py-16"
      >
        <div
          class="w-16 h-16 mx-auto mb-6
            rounded-full bg-red-100
            flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2
          class="text-xl font-bold
            text-slate-800 mb-2"
        >
          {{ errorTitle }}
        </h2>
        <p class="text-slate-600">
          {{ errorMessage }}
        </p>
        <p class="text-sm text-slate-400 mt-4">
          If you believe this is an error,
          please contact our office at
          (970) 818-3052.
        </p>
      </div>

      <!-- Signing ceremony -->
      <template v-else-if="data">
        <EsignSigningCeremony
          :document="data.document"
          :session="data.session"
          :token="token"
          :field-placements="
            data.fieldPlacements ?? []"
          @signed="onSigned"
          @error="onError"
        />

        <p
          v-if="signingError"
          class="max-w-3xl mx-auto mt-4
            text-sm text-red-600 text-center"
        >
          {{ signingError }}
        </p>
      </template>
    </main>

    <!-- Footer -->
    <footer
      class="px-6 py-4 text-center
        text-xs text-slate-400"
    >
      The Law Offices of Owen Hathaway
      &middot; Fort Collins, Colorado
      &middot; (970) 818-3052
    </footer>
  </div>
</template>
