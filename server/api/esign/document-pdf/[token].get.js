// Public: serve the unsigned document PDF
// for rendering in the signing page.
// Authenticated by signing token.

import { blob } from 'hub:blob'
import { getSessionByToken }
  from '../../../utils/esign/db'
import { isTokenExpired }
  from '../../../utils/esign/tokens'

export default defineEventHandler(
  async (event) => {
    const token = getRouterParam(event, 'token')

    const session
      = await getSessionByToken(token)

    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not found',
      })
    }

    if (
      session.status === 'REVOKED'
      || isTokenExpired(session.tokenExpiresAt)
    ) {
      throw createError({
        statusCode: 410,
        statusMessage: 'Link expired',
      })
    }

    const pdfKey
      = `esign/unsigned/${session.documentId}.pdf`

    return blob.serve(event, pdfKey)
  },
)
