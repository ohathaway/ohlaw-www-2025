// Admin: download the signed PDF from blob
// storage. Protected by admin-auth middleware.

import { blob } from 'hub:blob'
import { getDocumentById }
  from '../../../../../utils/esign/db'

export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    const document = await getDocumentById(id)

    if (!document?.signedPdfBlobKey) {
      throw createError({
        statusCode: 404,
        statusMessage:
          'Signed PDF not available',
      })
    }

    return blob.serve(
      event,
      document.signedPdfBlobKey,
    )
  },
)
