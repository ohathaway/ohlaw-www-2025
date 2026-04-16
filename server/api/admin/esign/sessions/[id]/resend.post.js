// Admin: resend signing request email.

import {
  getSessionById,
  getDocumentById,
} from '../../../../../utils/esign/db'
import { isTokenExpired }
  from '../../../../../utils/esign/tokens'
import { sendSigningRequest }
  from '../../../../../utils/esign/notifications'

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
          'Session is already signed',
      })
    }

    if (session.status === 'REVOKED') {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Session has been revoked',
      })
    }

    if (isTokenExpired(session.tokenExpiresAt)) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Signing link has expired',
      })
    }

    const document = await getDocumentById(
      session.documentId,
    )

    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found',
      })
    }

    const reqUrl = getRequestURL(event)
    const baseUrl = `${reqUrl.protocol}//${reqUrl.host}`

    await sendSigningRequest(
      session,
      document,
      baseUrl,
    )

    return { success: true }
  },
)
