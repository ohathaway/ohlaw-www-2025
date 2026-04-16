// Admin: save field placements for a document.

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
          'Cannot modify placements after '
          + 'document has been sent',
      })
    }

    if (!Array.isArray(body.placements)) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'placements must be an array',
      })
    }

    await updateDocument(id, {
      fieldPlacements:
        JSON.stringify(body.placements),
    })

    return { success: true }
  },
)
