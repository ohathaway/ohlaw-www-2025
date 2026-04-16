// Pinia store for in-progress e-sign document
// creation. Holds signer data across pages
// (new → prepare → detail/send).

export const useEsignDraftStore = defineStore(
  'esignDraft',
  () => {
    const signers = ref([
      { name: '', email: '', role: 1 },
    ])
    const documentId = ref(null)

    const setSigners = (list) => {
      signers.value = list
    }

    const setDocumentId = (id) => {
      documentId.value = id
    }

    const addSigner = () => {
      if (signers.value.length >= 6) return
      signers.value.push({
        name: '',
        email: '',
        role: signers.value.length + 1,
      })
    }

    const removeSigner = (index) => {
      if (signers.value.length <= 1) return
      signers.value.splice(index, 1)
      // Renumber roles
      signers.value.forEach((s, i) => {
        s.role = i + 1
      })
    }

    const setSignerCount = (count) => {
      while (signers.value.length < count) {
        signers.value.push({
          name: '',
          email: '',
          role: signers.value.length + 1,
        })
      }
      if (signers.value.length > count) {
        signers.value
          = signers.value.slice(0, count)
      }
    }

    const clear = () => {
      signers.value = [
        { name: '', email: '', role: 1 },
      ]
      documentId.value = null
    }

    return {
      signers,
      documentId,
      setSigners,
      setDocumentId,
      setSignerCount,
      addSigner,
      removeSigner,
      clear,
    }
  },
)
