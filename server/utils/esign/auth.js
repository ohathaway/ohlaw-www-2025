// Firebase Admin SDK for server-side token
// verification. Restricts access to
// @ohlawcolorado.com emails.
//
// Only needs projectId — no service account
// required since we're just verifying tokens
// against Google's public keys.

import { initializeApp, getApps }
  from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

let adminApp = null

const getAdminApp = () => {
  if (adminApp) return adminApp
  if (getApps().length) {
    adminApp = getApps()[0]
    return adminApp
  }

  const config = useRuntimeConfig()

  adminApp = initializeApp({
    projectId:
      config.public.firebase.projectId,
  })

  return adminApp
}

export const verifyIdToken = async (token) => {
  const app = getAdminApp()
  const decoded = await getAuth(app)
    .verifyIdToken(token)
  return decoded
}

const ALLOWED_DOMAIN = 'ohlawcolorado.com'

export const isAllowedEmail = email =>
  email?.endsWith(`@${ALLOWED_DOMAIN}`)
