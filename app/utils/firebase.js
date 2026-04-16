// Firebase client SDK initialization.
// Used for admin Google OAuth sign-in.

import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
} from 'firebase/auth'

let app = null
let auth = null

const getFirebaseApp = () => {
  if (app) return app
  if (getApps().length) {
    app = getApps()[0]
    return app
  }

  const config = useRuntimeConfig()
  app = initializeApp({
    apiKey: config.public.firebase.apiKey,
    authDomain:
      config.public.firebase.authDomain,
    projectId:
      config.public.firebase.projectId,
  })

  return app
}

export const getFirebaseAuth = () => {
  if (auth) return auth
  auth = getAuth(getFirebaseApp())
  return auth
}

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    hd: 'ohlawcolorado.com',
  })
  const result = await signInWithPopup(
    getFirebaseAuth(),
    provider,
  )
  return result.user
}

export const signOut = () =>
  fbSignOut(getFirebaseAuth())
