// Admin: send document for signature. Creates
// signing sessions for each signer and sends
// email notifications.

import {
  getDocumentById,
  updateDocument,
  createSession,
} from '../../../../../utils/esign/db'
import {
  generateSigningToken,
  calculateTokenExpiration,
  DEFAULT_TOKEN_EXPIRY,
} from '../../../../../utils/esign/tokens'
import { sendSigningRequest }
  from '../../../../../utils/esign/notifications'

export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    const document = await getDocumentById(id)

    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found',
      })
    }

    if (document.status !== 'DRAFT') {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Document has already been sent',
      })
    }

    const signers = body.signers
    if (!signers?.length) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'At least one signer is required',
      })
    }

    const expiry = calculateTokenExpiration(
      body.expiresIn ?? DEFAULT_TOKEN_EXPIRY,
    )

    const sessions = []

    for (const signer of signers) {
      if (!signer.name || !signer.email) {
        throw createError({
          statusCode: 400,
          statusMessage:
            'Each signer must have a name '
            + 'and email',
        })
      }

      const signingToken = generateSigningToken()

      const session = await createSession({
        documentId: id,
        signerName: signer.name,
        signerEmail: signer.email,
        signerRole: signer.role ?? 1,
        signingToken,
        tokenExpiresAt: expiry,
      })

      sessions.push({
        ...session,
        signerName: signer.name,
        signerEmail: signer.email,
      })

      // Send email (async, don't block)
      const reqUrl = getRequestURL(event)
      const baseUrl
        = `${reqUrl.protocol}//${reqUrl.host}`

      sendSigningRequest(
        {
          signerName: signer.name,
          signerEmail: signer.email,
          signingToken,
        },
        document,
        baseUrl,
      ).catch(err =>
        console.error(
          'Failed to send signing request:',
          err,
        ),
      )
    }

    await updateDocument(id, { status: 'SENT' })

    return { sessions }
  },
)
