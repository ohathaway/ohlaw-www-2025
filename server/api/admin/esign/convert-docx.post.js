// Admin: convert uploaded .docx file to HTML
// for use in ad hoc document signing.

import mammoth from 'mammoth'

export default defineEventHandler(
  async (event) => {
    const formData = await readMultipartFormData(
      event,
    )

    if (!formData?.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded',
      })
    }

    const file = formData.find(
      f => f.name === 'file',
    )

    if (!file?.data) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'File field "file" is required',
      })
    }

    const filename = file.filename ?? ''
    if (!filename.endsWith('.docx')) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Only .docx files are supported',
      })
    }

    try {
      const result = await mammoth.convertToHtml({
        buffer: file.data,
      })

      if (result.messages?.length) {
        console.info(
          'mammoth conversion messages:',
          result.messages,
        )
      }

      return { html: result.value }
    }
    catch (err) {
      console.error(
        'DOCX conversion failed:',
        err,
      )
      throw createError({
        statusCode: 500,
        statusMessage:
          'Failed to convert document',
      })
    }
  },
)
