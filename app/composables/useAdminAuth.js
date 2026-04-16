// Admin auth composable for Firebase Google
// OAuth. Provides sign-in, sign-out, token
// injection, and authenticated fetch wrapper.

import { ref, computed, onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import {
  getFirebaseAuth,
  signInWithGoogle,
  signOut,
} from '~/utils/firebase'

const user = ref(null)
const loading = ref(true)
let initialized = false

export const useAdminAuth = () => {
  const isAuthed = computed(() => !!user.value)

  const init = () => {
    if (initialized) return
    initialized = true

    const auth = getFirebaseAuth()
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

  onMounted(init)

  const signIn = async () => {
    const firebaseUser = await signInWithGoogle()
    const email = firebaseUser.email ?? ''

    if (!email.endsWith('@ohlawcolorado.com')) {
      await signOut()
      throw new Error(
        'Only @ohlawcolorado.com accounts '
        + 'are allowed',
      )
    }

    return firebaseUser
  }

  const getIdToken = async () => {
    if (!user.value) return null
    return user.value.getIdToken()
  }

  const authFetch = async (url, opts = {}) => {
    const token = await getIdToken()

    if (!token) {
      throw new Error('Not authenticated')
    }

    return $fetch(url, {
      ...opts,
      headers: {
        ...opts.headers,
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return {
    user,
    loading,
    isAuthed,
    signIn,
    signOut,
    getIdToken,
    authFetch,
  }
}
