<script setup>
const props = defineProps({
  sessions: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'resend',
  'revoke',
  'refresh',
])

const { authFetch } = useAdminAuth()
const error = ref(null)

const sessionStatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  VIEWED: 'bg-blue-100 text-blue-700',
  SIGNED: 'bg-green-100 text-green-700',
  EXPIRED: 'bg-slate-100 text-slate-500',
  REVOKED: 'bg-red-100 text-red-700',
}

const formatDate = (timestamp) => {
  if (!timestamp) return '—'
  const d = new Date(
    typeof timestamp === 'number'
      ? timestamp * 1000
      : timestamp,
  )
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const signingUrl = token =>
  `${window.location.origin}/sign/${token}`

const copyLink = async (token) => {
  await navigator.clipboard.writeText(
    signingUrl(token),
  )
}

const handleResend = async (sessionId) => {
  error.value = null
  try {
    await authFetch(
      `/api/admin/esign/sessions/`
      + `${sessionId}/resend`,
      { method: 'POST' },
    )
    alert('Email sent successfully')
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
}

const handleRevoke = async (sessionId) => {
  if (!confirm('Revoke this signing link?')) {
    return
  }
  error.value = null
  try {
    await authFetch(
      `/api/admin/esign/sessions/`
      + `${sessionId}/revoke`,
      { method: 'POST' },
    )
    emit('refresh')
  }
  catch (err) {
    error.value
      = err.data?.message ?? err.message
  }
}

const isActive = session =>
  session.status !== 'SIGNED'
  && session.status !== 'REVOKED'
</script>

<template>
  <div
    class="bg-white rounded-lg border
      border-slate-200"
  >
    <div
      class="px-4 py-3 border-b
        border-slate-200"
    >
      <h2
        class="text-sm font-semibold
          text-slate-700"
      >
        Signing Sessions
      </h2>
    </div>

    <div
      v-if="!sessions.length"
      class="px-4 py-6 text-center
        text-sm text-slate-400"
    >
      No signing sessions yet
    </div>

    <div
      v-for="session in sessions"
      :key="session.id"
      class="px-4 py-4 border-b
        border-slate-100 last:border-0"
    >
      <div
        class="flex items-center
        justify-between"
      >
        <div>
          <p
            class="font-medium text-sm
            text-slate-800"
          >
            {{ session.signerName }}
            <span
              class="text-slate-400
              font-normal"
            >
              ({{ session.signerEmail }})
            </span>
          </p>
          <div
            class="flex items-center gap-3
            mt-1"
          >
            <span
              class="px-2 py-0.5 rounded-full
                text-xs font-medium"
              :class="sessionStatusColors[
                session.status]"
            >
              {{ session.status }}
            </span>
            <span class="text-xs text-slate-400">
              Signer {{ session.signerRole }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="session.signingToken
              && isActive(session)"
            class="text-xs text-[#1E3A5F]
              hover:underline"
            @click="handleResend(session.id)"
          >
            Resend
          </button>
          <button
            v-if="session.signingToken
              && isActive(session)"
            class="text-xs text-[#1E3A5F]
              hover:underline"
            @click="copyLink(
              session.signingToken)"
          >
            Copy Link
          </button>
          <button
            v-if="isActive(session)"
            class="text-xs text-red-500
              hover:underline"
            @click="handleRevoke(session.id)"
          >
            Revoke
          </button>
        </div>
      </div>

      <div
        v-if="session.viewedAt
          || session.signedAt"
        class="mt-2 flex gap-4 text-xs
          text-slate-400"
      >
        <span v-if="session.viewedAt">
          Viewed: {{ formatDate(
            session.viewedAt) }}
        </span>
        <span v-if="session.signedAt">
          Signed: {{ formatDate(
            session.signedAt) }}
        </span>
      </div>
    </div>

    <p
      v-if="error"
      class="px-4 py-2 text-sm text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>
