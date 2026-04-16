// Admin: get document detail with all signing
// sessions.

import {
  getDocumentById,
  getSessionsByDocumentId,
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

    const sessions
      = await getSessionsByDocumentId(id)

    return { document, sessions }
  },
)
