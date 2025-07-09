/**
 * Blog PDF URL Retrieval API
 * Returns PDF URL if it exists in blob storage
 */

import { getBlogPDFUrl } from '../../utils/blog/generateBlogPDF.js'

export default defineEventHandler(async (event) => {
  try {
    const { slug } = await readBody(event)

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug is required',
      })
    }

    const pdfUrl = await getBlogPDFUrl(slug)

    if (!pdfUrl) {
      throw createError({
        statusCode: 404,
        statusMessage: 'PDF not found',
      })
    }

    return {
      success: true,
      pdf: pdfUrl,
      slug,
    }
  }
  catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve PDF URL',
      data: { error: error.message },
    })
  }
})