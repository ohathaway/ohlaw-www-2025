// Admin: revoke a signing session.

import {
  getSessionById,
  revokeSession,
} from '../../../../../utils/esign/db'

export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    const session = await getSessionById(id)

    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Session not found',
      })
    }

    if (session.status === 'SIGNED') {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Cannot revoke a signed session',
      })
    }

    await revokeSession(id)

    return { success: true }
  },
)
