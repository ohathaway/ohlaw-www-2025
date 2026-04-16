// Admin: void a document (sets status to VOIDED)

import {
  getDocumentById,
  updateDocument,
} from '../../../../utils/esign/db'

export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')
    const document = await getDocumentById(id)

    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found',
      })
    }

    if (document.status === 'COMPLETED') {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Cannot void a completed document',
      })
    }

    await updateDocument(id, {
      status: 'VOIDED',
    })

    return { success: true }
  },
)
