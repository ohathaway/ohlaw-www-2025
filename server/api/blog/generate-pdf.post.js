/**
 * Manual Blog PDF Generation API
 * Allows manual generation of blog PDFs
 */

import { generateAndStoreBlogPDF, getBlogPDFUrl } from '../../utils/blog/generateBlogPDF.js'

export default defineEventHandler(async (event) => {
  try {
    const { slug, documentId, regenerate = false } = await readBody(event)

    if (!slug && !documentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Either slug or documentId is required',
      })
    }

    // Check if PDF already exists (unless regenerate is true)
    if (!regenerate && slug) {
      const existingPdfUrl = await getBlogPDFUrl(slug)
      if (existingPdfUrl) {
        return {
          success: true,
          message: 'PDF already exists',
          pdf: existingPdfUrl,
          slug,
          regenerated: false,
        }
      }
    }

    // If we only have slug, we need to fetch the documentId
    let finalDocumentId = documentId
    let finalSlug = slug

    if (!finalDocumentId && slug) {
      // Fetch blog post by slug to get documentId
      const url = `${useRuntimeConfig().public.strapiUrl}/api/posts?filters[slug][$eq]=${slug}&pagination[limit]=1`
      const posts = await $fetch(url)

      if (!posts.data || posts.data.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Blog post not found',
        })
      }

      finalDocumentId = posts.data[0].documentId
    }

    if (!finalDocumentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Could not determine document ID',
      })
    }

    // Generate PDF
    const pdfUrl = await generateAndStoreBlogPDF(finalDocumentId, finalSlug)

    return {
      success: true,
      message: 'Blog PDF generated successfully',
      pdf: pdfUrl,
      slug: finalSlug,
      regenerated: regenerate,
    }
  }
  catch (error) {
    console.error('Manual PDF generation error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate blog PDF',
      data: { error: error.message },
    })
  }
})