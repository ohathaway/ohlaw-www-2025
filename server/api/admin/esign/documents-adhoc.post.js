// Admin: create an ad hoc document from an
// uploaded .docx file. Converts to PDF via
// the converter service. Returns DRAFT
// document ready for field placement.

import { blob } from 'hub:blob'
import mammoth from 'mammoth'
import { createDocument }
  from '../../../utils/esign/db'
import { convertDocxToPdf }
  from '../../../utils/esign/pdf-converter'

export default defineEventHandler(
  async (event) => {
    const formData
      = await readMultipartFormData(event)

    if (!formData?.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded',
      })
    }

    const file = formData.find(
      f => f.name === 'file',
    )
    const title = formData
      .find(f => f.name === 'title')
      ?.data?.toString()
      || file?.filename?.replace(
        /\.docx$/i, '',
      )
      || 'Untitled Document'
    const signerCount = parseInt(
      formData
        .find(f => f.name === 'signerCount')
        ?.data?.toString() ?? '1',
      10,
    )
    const signersJson = formData
      .find(f => f.name === 'signers')
      ?.data?.toString() ?? '[]'

    if (!file?.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File is required',
      })
    }

    // Convert DOCX to HTML (fallback viewer)
    const htmlResult
      = await mammoth.convertToHtml(
        { buffer: file.data },
      )

    // Convert DOCX to PDF
    const pdfBuffer
      = await convertDocxToPdf(file.data)

    // Create document record
    const document = await createDocument({
      title,
      templateType: 'adhoc',
      templateVars: { signers: JSON.parse(signersJson) },
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
      new Uint8Array(file.data),
      {
        contentType:
          'application/vnd.openxmlformats'
          + '-officedocument'
          + '.wordprocessingml.document',
      },
    )

    return { document }
  },
)
