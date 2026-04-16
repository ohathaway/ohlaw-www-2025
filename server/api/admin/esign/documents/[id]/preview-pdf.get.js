// Admin: serve the document PDF for preview.
// Shows signed PDF if completed, otherwise
// unsigned. Auth handled by middleware.

import { blob } from 'hub:blob'
import { getDocumentById }
  from '../../../../../utils/esign/db'

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

    const key
      = document.status === 'COMPLETED'
        && document.signedPdfBlobKey
        ? document.signedPdfBlobKey
        : `esign/unsigned/${id}.pdf`

    return blob.serve(event, key)
  },
)
