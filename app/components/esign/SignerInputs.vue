<script setup>
const draftStore = useEsignDraftStore()
const { signers } = storeToRefs(draftStore)
</script>

<template>
  <div>
    <div
      class="flex items-center justify-between
        mb-3"
    >
      <span
        class="text-xs font-medium
          text-slate-500"
      >
        Signers
      </span>
      <button
        v-if="signers.length < 6"
        class="text-xs text-[#1E3A5F]
          hover:underline"
        @click="draftStore.addSigner()"
      >
        + Add Signer
      </button>
    </div>

    <div
      v-for="(signer, i) in signers"
      :key="i"
      class="flex gap-3 mb-3 items-end"
    >
      <div
        class="w-8 h-8 rounded-md bg-slate-100
          flex items-center justify-center
          text-xs font-bold text-slate-500
          shrink-0"
      >
        {{ signer.role }}
      </div>
      <div class="flex-1">
        <label
          v-if="i === 0"
          class="block text-xs text-slate-500
            mb-1"
        >
          Name
        </label>
        <input
          v-model="signer.name"
          type="text"
          class="w-full px-3 py-2 border
            border-slate-300 rounded-lg text-sm"
          placeholder="Signer name"
        />
      </div>
      <div class="flex-1">
        <label
          v-if="i === 0"
          class="block text-xs text-slate-500
            mb-1"
        >
          Email
        </label>
        <input
          v-model="signer.email"
          type="email"
          class="w-full px-3 py-2 border
            border-slate-300 rounded-lg text-sm"
          placeholder="email@example.com"
        />
      </div>
      <button
        v-if="signers.length > 1"
        class="pb-2 text-slate-400
          hover:text-red-500"
        @click="draftStore.removeSigner(i)"
      >
        <i class="bi bi-x-lg" />
      </button>
    </div>
  </div>
</template>
