// Admin: update the signer count on a
// DRAFT document.

import {
  getDocumentById,
  updateDocument,
} from '../../../../../utils/esign/db'

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
          'Cannot modify after sending',
      })
    }

    const count = parseInt(body.signerCount, 10)
    if (!count || count < 1 || count > 6) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'signerCount must be 1-6',
      })
    }

    // Also clean up placements for removed
    // signers
    if (document.fieldPlacements) {
      const placements = JSON.parse(
        document.fieldPlacements,
      ).filter(
        f => Number(f.signerRole) <= count,
      )
      await updateDocument(id, {
        signerCount: count,
        fieldPlacements:
          JSON.stringify(placements),
      })
    }
    else {
      await updateDocument(id, {
        signerCount: count,
      })
    }

    return { success: true }
  },
)
