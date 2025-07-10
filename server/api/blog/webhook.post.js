/**
 * Blog PDF Generation Webhook
 * Handles Strapi webhooks for automatic PDF generation
 */

import { generateAndStoreBlogPDF } from '../../utils/blog/generateBlogPDF.js'

export default defineEventHandler(async (event) => {
  try {
    // Verify webhook source (optional - add webhook secret validation)
    const body = await readBody(event)
    
    // Log webhook for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Blog webhook received:', {
        model: body.model,
        event: body.event,
        entry: body.entry?.documentId,
        slug: body.entry?.slug,
      })
    }

    // Only process blog post events
    if (body.model !== 'api::post.post') {
      return { success: true, message: 'Not a blog post event' }
    }

    // Only process publish and update events
    if (!['entry.publish', 'entry.update'].includes(body.event)) {
      return { success: true, message: 'Event type not handled' }
    }

    const { entry } = body
    if (!entry?.documentId || !entry?.slug) {
      throw new Error('Missing required entry data')
    }

    // Generate and store PDF
    const pdfUrl = await generateAndStoreBlogPDF(entry.documentId, entry.slug)

    return {
      success: true,
      message: 'Blog PDF generated successfully',
      pdf: pdfUrl,
      slug: entry.slug,
    }
  }
  catch (error) {
    console.error('Blog webhook error:', error)
    
    // Return error response
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate blog PDF',
      data: { error: error.message },
    })
  }
})