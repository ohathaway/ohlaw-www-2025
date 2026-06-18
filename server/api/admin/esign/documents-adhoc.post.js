// Admin: create an ad hoc document from an
// uploaded .docx or .pdf file. DOCX is
// converted to PDF via the converter service;
// PDF is used as-is. Returns DRAFT document
// ready for field placement.
//
// Accepts JSON body with base64-encoded file:
// { title, signerCount, signers, fileName,
//   fileBase64 }

import { blob } from 'hub:blob'
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

      const fileBuffer = Buffer.from(
        body.fileBase64, 'base64',
      )
      const fileName = body.fileName ?? ''
      // Detect PDF by magic bytes (%PDF),
      // falling back to the file extension
      const isPdf
        = fileBuffer.subarray(0, 4)
          .toString('latin1') === '%PDF'
          || /\.pdf$/i.test(fileName)
      const title = body.title
        || (fileName || 'Untitled')
          .replace(/\.(docx|pdf)$/i, '')
      const signerCount
        = parseInt(body.signerCount, 10) || 1
      const signers = body.signers ?? []

      // Use PDF as-is; convert DOCX to PDF
      const pdfBuffer = isPdf
        ? fileBuffer
        : await convertDocxToPdf(fileBuffer)

      // Create document record
      const document = await createDocument({
        title,
        templateType: 'adhoc',
        templateVars: { signers },
        contentHtml: `<p>${title}</p>`,
        signerCount,
      })

      // Store unsigned PDF
      await blob.put(
        `esign/unsigned/${document.id}.pdf`,
        new Uint8Array(pdfBuffer),
        { contentType: 'application/pdf' },
      )

      // Store original DOCX as backup (PDF
      // uploads are already stored above)
      if (!isPdf) {
        await blob.put(
          `esign/filled/${document.id}.docx`,
          new Uint8Array(fileBuffer),
          {
            contentType:
              'application/vnd.openxmlformats'
              + '-officedocument'
              + '.wordprocessingml.document',
          },
        )
      }

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
