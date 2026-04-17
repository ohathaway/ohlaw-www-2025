// Admin: create an ad hoc document from an
// uploaded .docx file. Converts to PDF via
// the converter service. Returns DRAFT
// document ready for field placement.
//
// Accepts JSON body with base64-encoded file:
// { title, signerCount, signers, fileName,
//   fileBase64 }

import { blob } from 'hub:blob'
import mammoth from 'mammoth'
import { createDocument }
  from '../../../utils/esign/db'
import { convertDocxToPdf }
  from '../../../utils/esign/pdf-converter'

export default defineEventHandler(
  async (event) => {
    try {
      const body = await readBody(event)

      if (!body.fileBase64) {
        throw createError({
          statusCode: 400,
          statusMessage: 'File is required',
        })
      }

      const docxBuffer = Buffer.from(
        body.fileBase64, 'base64',
      )
      const title = body.title
        || (body.fileName ?? 'Untitled')
          .replace(/\.docx$/i, '')
      const signerCount
        = parseInt(body.signerCount, 10) || 1
      const signers = body.signers ?? []

      // Convert DOCX to HTML (fallback viewer)
      const htmlResult
        = await mammoth.convertToHtml(
          { buffer: docxBuffer },
        )

      // Convert DOCX to PDF
      const pdfBuffer
        = await convertDocxToPdf(docxBuffer)

      // Create document record
      const document = await createDocument({
        title,
        templateType: 'adhoc',
        templateVars: { signers },
        contentHtml: htmlResult.value,
        signerCount,
      })

      // Store unsigned PDF
      await blob.put(
        `esign/unsigned/${document.id}.pdf`,
        new Uint8Array(pdfBuffer),
        { contentType: 'application/pdf' },
      )

      // Store original DOCX as backup
      await blob.put(
        `esign/filled/${document.id}.docx`,
        new Uint8Array(docxBuffer),
        {
          contentType:
            'application/vnd.openxmlformats'
            + '-officedocument'
            + '.wordprocessingml.document',
        },
      )

      return { document }
    }
    catch (err) {
      console.error('Ad hoc upload error:', err)
      throw createError({
        statusCode: err.statusCode ?? 500,
        statusMessage: err.message
          ?? 'Document creation failed',
      })
    }
  },
)
