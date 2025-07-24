/**
 * Blog PDF Generation Utility
 * Extends existing PDF rendering system for blog content
 */

import PDFDocument from 'pdfkit'
import { renderRichTextToPdf } from '../quizzes/renderRichText2Pdf.js'
import { addQRToPDF } from '../qrcode/index.js'

/**
 * Generates a PDF from blog post content
 * @param {Object} post - Blog post data from Strapi
 * @param {Object} options - Configuration options
 * @returns {Promise<Buffer>} PDF buffer
 */
export const generateBlogPDF = async (post, options = {}) => {
  const {
    includeQRCode = true,
    includeMetadata = true,
    optimizeForPrint = true,
    margins = { top: 72, bottom: 72, left: 72, right: 72 },
  } = options

  // Create PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margins,
    bufferPages: true,
  })

  // Buffer to collect PDF data
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))

  try {
    // Add blog-specific styling configuration
    const config = {
      margins,
      contentWidth: doc.page.width - margins.left - margins.right,
      baseFont: 'Helvetica',
      headingFont: 'Helvetica-Bold',
      codeFont: 'Courier',
      colors: {
        primary: '#38507a', // chambray-700
        text: '#374151', // gray-700
        muted: '#6b7280', // gray-500
        link: '#2563eb', // blue-600
      },
    }

    // Add header
    await addBlogHeader(doc, post, config)

    // Add main content
    await addBlogContent(doc, post, config)

    // Add footer with QR code if enabled
    if (includeQRCode) {
      await addBlogFooter(doc, post, config)
    }

    // Finalize PDF
    doc.end()

    // Return promise that resolves when PDF is complete
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers)
        resolve(pdfBuffer)
      })
      doc.on('error', reject)
    })
  }
  catch (error) {
    throw new Error(`Failed to generate blog PDF: ${error.message}`)
  }
}

/**
 * Adds blog header with title, metadata, and branding
 */
const addBlogHeader = async (doc, post, config) => {
  const { margins, contentWidth, headingFont, baseFont, colors } = config

  // Add OH Law branding
  doc.font(headingFont)
    .fontSize(12)
    .fillColor(colors.primary)
    .text('The Law Offices of Owen Hathaway', margins.left, margins.top)

  // Add blog title
  doc.font(headingFont)
    .fontSize(24)
    .fillColor(colors.text)
    .text(post.Title, margins.left, doc.y + 20, {
      width: contentWidth,
      align: 'left',
    })

  // Add metadata
  if (post.publishedAt) {
    const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    doc.font(baseFont)
      .fontSize(10)
      .fillColor(colors.muted)
      .text(`Published: ${publishDate}`, margins.left, doc.y + 10)
  }

  // Add separator line
  doc.strokeColor(colors.muted)
    .lineWidth(1)
    .moveTo(margins.left, doc.y + 15)
    .lineTo(margins.left + contentWidth, doc.y + 15)
    .stroke()

  // Add spacing
  doc.y += 25
}

/**
 * Adds main blog content using existing rich text renderer
 */
const addBlogContent = async (doc, post, config) => {
  if (!post.Content) {
    doc.font(config.baseFont)
      .fontSize(12)
      .fillColor(config.colors.muted)
      .text('No content available', config.margins.left, doc.y)
    return
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Content structure:', {
      isArray: Array.isArray(post.Content),
      length: post.Content?.length,
      firstItem: post.Content?.[0],
    })
  }

  // Use existing rich text renderer with blog-specific configuration
  const blogConfig = {
    ...config,
    // Blog-specific font sizes
    headingSizes: {
      h1: 20,
      h2: 18,
      h3: 16,
      h4: 14,
      h5: 12,
      h6: 11,
    },
    paragraphSize: 11,
    lineHeight: 1.4,
    // Enhanced spacing for readability
    paragraphSpacing: 12,
    headingSpacing: 20,
    listIndent: 20,
  }

  try {
    // Convert Strapi 5 rich text format to simple text for now
    await renderSimpleBlogContent(doc, post.Content, blogConfig)
  }
  catch (error) {
    console.error('Error in renderSimpleBlogContent:', error)
    // Fallback: add simple text
    doc.font(config.baseFont)
      .fontSize(12)
      .fillColor(config.colors.text)
      .text('Error rendering content', config.margins.left, doc.y)
  }
}

/**
 * Simple blog content renderer for Strapi 5 rich text format
 */
const renderSimpleBlogContent = async (doc, content, config) => {
  for (const block of content) {
    switch (block.type) {
      case 'paragraph':
        await renderParagraphBlock(doc, block, config)
        break
      case 'heading':
        await renderHeadingBlock(doc, block, config)
        break
      case 'list':
        await renderListBlock(doc, block, config)
        break
      default:
        // Skip unknown block types
        console.warn(`Unknown block type: ${block.type}`)
    }
  }
}

const renderParagraphBlock = async (doc, block, config) => {
  const text = extractTextFromChildren(block.children)
  if (text.trim()) {
    doc.font(config.baseFont)
      .fontSize(config.paragraphSize || 12)
      .fillColor(config.colors.text)
      .text(text, config.margins.left, doc.y, {
        width: config.contentWidth,
        align: 'left',
      })

    doc.y += config.paragraphSpacing || 12
  }
}

const renderHeadingBlock = async (doc, block, config) => {
  const text = extractTextFromChildren(block.children)
  const level = block.level || 1
  const fontSize = config.headingSizes[`h${level}`] || 16

  doc.font(config.headingFont)
    .fontSize(fontSize)
    .fillColor(config.colors.text)
    .text(text, config.margins.left, doc.y, {
      width: config.contentWidth,
      align: 'left',
    })

  doc.y += config.headingSpacing || 20
}

const renderListBlock = async (doc, block, config) => {
  // For now, just render as simple text
  const text = extractTextFromChildren(block.children)
  if (text.trim()) {
    doc.font(config.baseFont)
      .fontSize(config.paragraphSize || 12)
      .fillColor(config.colors.text)
      .text(`• ${text}`, config.margins.left, doc.y, {
        width: config.contentWidth,
        align: 'left',
      })

    doc.y += config.paragraphSpacing || 12
  }
}

const extractTextFromChildren = (children) => {
  if (!children || !Array.isArray(children)) return ''

  return children.map((child) => {
    if (child.type === 'text') {
      return child.text || ''
    }
    if (child.children) {
      return extractTextFromChildren(child.children)
    }
    return ''
  }).join('')
}

/**
 * Adds footer with QR code and additional metadata
 */
const addBlogFooter = async (doc, post, config) => {
  const { margins, contentWidth, baseFont, colors } = config
  const appConfig = useAppConfig()

  // Check if we need a new page for footer
  const footerHeight = 120
  if (doc.y > doc.page.height - margins.bottom - footerHeight) {
    doc.addPage()
  }

  // Position footer at bottom of page
  const footerY = doc.page.height - margins.bottom - footerHeight

  // Add separator line
  doc.strokeColor(colors.muted)
    .lineWidth(1)
    .moveTo(margins.left, footerY)
    .lineTo(margins.left + contentWidth, footerY)
    .stroke()

  // Add QR code for article URL
  const articleUrl = `${appConfig.seo.siteUrl}/blog/${post.slug}`

  try {
    await addQRToPDF(doc, articleUrl, {
      x: margins.left,
      y: footerY + 10,
      width: 80,
      height: 80,
      preset: 'professional',
    })

    // Add QR code caption and footer text
    doc.font(baseFont)
      .fontSize(8)
      .fillColor(colors.muted)
      .text('Scan for online version', margins.left, footerY + 95, {
        width: 80,
        align: 'center',
      })
  }
  catch (error) {
    console.warn('Failed to add QR code to blog PDF:', error.message)
  }

  // Add footer text
  doc.font(baseFont)
    .fontSize(10)
    .fillColor(colors.text)
    .text(appConfig.seo.siteName, margins.left + 100, footerY + 15)

  doc.fontSize(9)
    .fillColor(colors.muted)
    .text(
      `${appConfig.seo.address.street}, ${appConfig.seo.address.city}, ${appConfig.seo.address.state} ${appConfig.seo.address.zip}`,
      margins.left + 100,
      footerY + 30,
    )

  doc.text(`Phone: ${appConfig.seo.phone}`, margins.left + 100, footerY + 45)
  doc.text(`Email: ${appConfig.contactEmail}`, margins.left + 100, footerY + 60)
  doc.text(`Website: ${appConfig.seo.siteUrl}`, margins.left + 100, footerY + 75)
}

/**
 * Generates blog PDF buffer (without storage)
 * @param {string} documentId - Strapi document ID
 * @returns {Promise<{buffer: Buffer, post: Object}>} PDF buffer and post data
 */
export const generateBlogPDFBuffer = async (documentId) => {
  try {
    // Fetch blog post from Strapi
    const apiUrl = `${useRuntimeConfig().public.strapiUrl}/api/posts/${documentId}?populate=*`
    const post = await $fetch(apiUrl)

    if (!post?.data) {
      throw new Error(`Blog post not found: ${documentId}`)
    }

    // Generate PDF
    const pdfBuffer = await generateBlogPDF(post.data, {
      includeQRCode: false, // Disable QR codes for now
      includeMetadata: true,
      optimizeForPrint: true,
    })

    return { buffer: pdfBuffer, post: post.data }
  }
  catch (error) {
    console.error(`Failed to generate blog PDF for ${documentId}:`, error)
    throw error
  }
}

/**
 * Generates and stores blog PDF in public R2 bucket
 * @param {string} documentId - Strapi document ID
 * @param {string} slug - Blog post slug
 * @returns {Promise<string>} Public PDF URL
 */
export const generateAndStoreBlogPDF = async (documentId, slug) => {
  try {
    // Import here to avoid circular dependency
    const { uploadPdfToR2 } = await import('../reports/index.js')

    // Generate PDF buffer
    const { buffer: pdfBuffer } = await generateBlogPDFBuffer(documentId)

    // Store in public R2 bucket
    const appConfig = useAppConfig()
    const filename = `${slug}.pdf`
    const bucketName = appConfig.blogPdfs.bucketName
    const keyName = `${appConfig.blogPdfs.prefix}/${filename}`

    await uploadPdfToR2(pdfBuffer, keyName, bucketName)

    // Construct the public URL
    const url = `${appConfig.blogPdfs.publicDomain}/${keyName}`

    if (process.env.NODE_ENV === 'development') {
      console.log(`Generated blog PDF: ${filename} (${url})`)
    }
    return url
  }
  catch (error) {
    console.error(`Failed to generate blog PDF for ${slug}:`, error)
    throw error
  }
}

/**
 * Checks if PDF exists in blob storage
 * @param {string} slug - Blog post slug
 * @returns {Promise<boolean>} Whether PDF exists
 */
export const blogPDFExists = async (slug) => {
  try {
    const filename = `blog-pdfs/${slug}.pdf`
    const { url } = await hubBlob().head(filename)
    return !!url
  }
  catch (error) {
    return false
  }
}

/**
 * Gets blog PDF URL from public R2 bucket
 * @param {string} slug - Blog post slug
 * @returns {Promise<string|null>} PDF URL or null if not found
 */
export const getBlogPDFUrl = async (slug) => {
  try {
    const appConfig = useAppConfig()
    const filename = `${slug}.pdf`
    const keyName = `${appConfig.blogPdfs.prefix}/${filename}`

    // For public bucket, we can construct the URL directly
    const url = `${appConfig.blogPdfs.publicDomain}/${keyName}`

    // Test if the file exists by making a HEAD request
    const response = await fetch(url, { method: 'HEAD' })

    if (response.ok) {
      return url
    }

    return null
  }
  catch (error) {
    console.error(`Failed to get PDF URL for ${slug}:`, error)
    return null
  }
}
