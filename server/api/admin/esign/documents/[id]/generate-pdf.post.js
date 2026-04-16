// Admin: retry signed PDF generation for a
// completed document. Loads the unsigned PDF
// and appends signature pages.

import { blob } from 'hub:blob'
import {
  getDocumentById,
  getSessionsByDocumentId,
  markDocumentCompleted,
} from '../../../../../utils/esign/db'
import { stampFieldsAndSign }
  from '../../../../../utils/esign/document-pdf'

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

    if (document.status !== 'COMPLETED') {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Document is not yet completed',
      })
    }

    const sessions
      = await getSessionsByDocumentId(id)

    const allSigned = sessions.every(
      s => s.status === 'SIGNED',
    )

    if (!allSigned) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Not all sessions are signed',
      })
    }

    // Load unsigned PDF
    const unsignedKey
      = `esign/unsigned/${id}.pdf`
    const unsignedBlob
      = await blob.get(unsignedKey)

    if (!unsignedBlob) {
      throw createError({
        statusCode: 404,
        statusMessage:
          'Unsigned PDF not found',
      })
    }

    const unsignedBytes = new Uint8Array(
      await unsignedBlob.arrayBuffer(),
    )

    // Stamp fields and append certificate
    const placements
      = document.fieldPlacements
        ? JSON.parse(document.fieldPlacements)
        : []

    const signedBytes
      = await stampFieldsAndSign(
        unsignedBytes,
        placements,
        sessions,
      )

    const blobKey
      = `esign/signed/${id}.pdf`
    await blob.put(
      blobKey,
      new Uint8Array(signedBytes),
      { contentType: 'application/pdf' },
    )

    await markDocumentCompleted(id, blobKey)

    return { success: true }
  },
)
