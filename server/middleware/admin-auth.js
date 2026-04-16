// Nitro server middleware protecting /api/admin
// routes. Verifies Firebase ID tokens and
// restricts to @ohlawcolorado.com emails.
// Accepts token via Authorization header or
// ?token= query param (for fetch/window.open).

import {
  verifyIdToken,
  isAllowedEmail,
} from '../utils/esign/auth'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Only protect admin API routes
  if (!path.startsWith('/api/admin')) return

  try {
    const authHeader = getRequestHeader(
      event,
      'authorization',
    )
    const query = getQuery(event)

    const idToken
      = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : query.token

    if (!idToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Missing auth token',
      })
    }

    const decoded = await verifyIdToken(idToken)

    if (!isAllowedEmail(decoded.email)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Unauthorized domain',
      })
    }

    event.context.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name ?? decoded.email,
    }
  }
  catch (err) {
    if (err.statusCode) throw err
    // Surface the actual error in dev/debug
    console.error('Admin auth error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Auth error: ${err.message}`,
    })
  }
})
