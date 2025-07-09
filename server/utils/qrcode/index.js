/**
 * Server-side QR Code Integration
 * Provides QR code generation utilities for server-side use
 * Compatible with PDF generation and file operations
 */

import {
  generateQRForPDF as generateQRForPDFBase,
  generateQRCode,
  generateQRSVG,
  createStyledQRCode,
} from '../../../app/utils/qrcode/generator.js'
import { validateQRContent, formatQRContent } from '../../../app/utils/qrcode/validation.js'

/**
 * Generates QR code for PDF embedding
 * @param {string} content - Content to encode
 * @param {Object} options - Configuration options
 * @returns {Promise<Buffer>} PNG buffer for PDF
 */
export const generateQRForPDF = async (content, options = {}) => {
  const pdfOptions = {
    format: 'png',
    size: 'large',
    preset: 'highContrast', // Better for PDF printing
    errorCorrectionLevel: 'H', // High error correction for print
    ...options,
  }

  try {
    const buffer = await generateQRForPDFBase(content, pdfOptions)
    return buffer
  }
  catch (error) {
    throw new Error(`Server QR generation failed: ${error.message}`)
  }
}

/**
 * Adds QR code to PDF document
 * @param {PDFDocument} doc - PDFKit document
 * @param {string} content - Content to encode
 * @param {Object} options - Configuration options
 * @returns {Promise<void>}
 */
export const addQRToPDF = async (doc, content, options = {}) => {
  const {
    x = 50,
    y = 50,
    width = 100,
    height = 100,
    align = 'left',
    valign = 'top',
    ...qrOptions
  } = options

  try {
    // Generate QR code buffer
    const qrBuffer = await generateQRForPDFBase(content, qrOptions)

    // Calculate position based on alignment
    let finalX = x
    let finalY = y

    if (align === 'center') {
      finalX = (doc.page.width - width) / 2
    }
    else if (align === 'right') {
      finalX = doc.page.width - width - x
    }

    if (valign === 'middle') {
      finalY = (doc.page.height - height) / 2
    }
    else if (valign === 'bottom') {
      finalY = doc.page.height - height - y
    }

    // Add QR code to PDF
    doc.image(qrBuffer, finalX, finalY, { width, height })

    return { x: finalX, y: finalY, width, height }
  }
  catch (error) {
    throw new Error(`Failed to add QR code to PDF: ${error.message}`)
  }
}

/**
 * Creates a QR code block for rich text PDF rendering
 * @param {string} content - Content to encode
 * @param {Object} options - Configuration options
 * @returns {Object} QR code block for PDF rendering
 */
export const createQRBlock = (content, options = {}) => {
  const {
    size = 'medium',
    preset = 'professional',
    caption = null,
    align = 'center',
    ...qrOptions
  } = options

  return {
    type: 'qr-code',
    content,
    size,
    preset,
    caption,
    align,
    options: qrOptions,
  }
}

/**
 * Renders QR code block in PDF (for rich text rendering system)
 * @param {PDFDocument} doc - PDFKit document
 * @param {Object} block - QR code block
 * @param {Object} config - Rendering configuration
 * @returns {PDFDocument} Modified document
 */
export const renderQRBlock = async (doc, block, config) => {
  const {
    content,
    size = 'medium',
    preset = 'professional',
    caption = null,
    align = 'center',
    options = {},
  } = block

  // Size mapping for PDF
  const sizeMap = {
    small: 80,
    medium: 120,
    large: 160,
    print: 200,
  }

  const qrSize = sizeMap[size] || 120
  const margin = 10
  const currentY = doc.y

  try {
    // Generate QR code
    const qrBuffer = await generateQRForPDFBase(content, {
      size: 'large', // Always use large for PDF clarity
      preset,
      ...options,
    })

    // Calculate position based on alignment
    let x = config.margins.left
    if (align === 'center') {
      x = (doc.page.width - qrSize) / 2
    }
    else if (align === 'right') {
      x = doc.page.width - config.margins.right - qrSize
    }

    // Check if QR code fits on current page
    if (currentY + qrSize + margin > doc.page.height - config.margins.bottom) {
      doc.addPage()
    }

    // Add QR code
    doc.image(qrBuffer, x, doc.y, { width: qrSize, height: qrSize })

    // Move cursor down
    doc.y += qrSize + margin

    // Add caption if provided
    if (caption) {
      doc.font(config.baseFont)
        .fontSize(10)
        .fillColor('#666666')
        .text(caption, config.margins.left, doc.y, {
          width: config.contentWidth,
          align: align,
        })

      doc.y += 15 // Add space after caption
    }

    return doc
  }
  catch (error) {
    // Fallback: Add error message instead of QR code
    doc.font(config.baseFont)
      .fontSize(10)
      .fillColor('#FF0000')
      .text(`[QR Code Error: ${error.message}]`, config.margins.left, doc.y)

    doc.y += 20
    return doc
  }
}

/**
 * Generates OH Law contact QR code for server use
 * @param {Object} contactInfo - Contact information
 * @returns {Promise<Buffer>} QR code buffer
 */
export const generateOHLawContactQRForServer = async (contactInfo = {}) => {
  try {
    // Use the app config for default contact info  
    const appConfig = await import('../../app.config.js').then(m => m.default())

    const defaultContact = {
      name: appConfig.seo.founder.name,
      organization: appConfig.seo.siteName,
      phone: appConfig.phoneNumbers.voice,
      email: appConfig.contactEmail,
      website: appConfig.seo.siteUrl,
      address: `${appConfig.seo.address.street}, ${appConfig.seo.address.city}, ${appConfig.seo.address.state} ${appConfig.seo.address.zip}`,
    }

    const contact = { ...defaultContact, ...contactInfo }

    // Generate vCard format
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contact.name}`,
      `ORG:${contact.organization}`,
      `TEL:${contact.phone}`,
      `EMAIL:${contact.email}`,
      `URL:${contact.website}`,
      `ADR:;;${contact.address}`,
      'END:VCARD',
    ].join('\n')

    return await generateQRForPDFBase(vcard, {
      preset: 'professional',
      size: 'large',
    })
  }
  catch (error) {
    throw new Error(`Failed to generate OH Law contact QR: ${error.message}`)
  }
}

/**
 * Generates OH Law location QR code for server use
 * @returns {Promise<Buffer>} QR code buffer
 */
export const generateOHLawLocationQRForServer = async () => {
  try {
    const appConfig = await import('../../app.config.js').then(m => m.default())

    const address = `${appConfig.seo.address.street}, ${appConfig.seo.address.city}, ${appConfig.seo.address.state} ${appConfig.seo.address.zip}`
    const locationQuery = `${appConfig.seo.siteName} ${address}`
    const locationString = `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}`

    return await generateQRForPDFBase(locationString, {
      preset: 'professional',
      size: 'large',
    })
  }
  catch (error) {
    throw new Error(`Failed to generate OH Law location QR: ${error.message}`)
  }
}

/**
 * Batch generates QR codes for server use
 * @param {Array} qrSpecs - Array of QR code specifications
 * @returns {Promise<Array>} Array of results
 */
export const batchGenerateQRForServer = async (qrSpecs) => {
  const results = []

  for (const spec of qrSpecs) {
    try {
      const buffer = await generateQRForPDFBase(spec.content, spec.options)
      results.push({
        success: true,
        content: spec.content,
        buffer,
        id: spec.id,
      })
    }
    catch (error) {
      results.push({
        success: false,
        content: spec.content,
        error: error.message,
        id: spec.id,
      })
    }
  }

  return results
}

/**
 * Saves QR code to file system
 * @param {string} content - Content to encode
 * @param {string} filepath - Path to save file
 * @param {Object} options - Configuration options
 * @returns {Promise<void>}
 */
export const saveQRToFile = async (content, filepath, options = {}) => {
  const { format = 'png', ...qrOptions } = options

  try {
    const data = await generateQRCode(content, { format, ...qrOptions })

    // Write to file system
    await $fetch('/api/files/write', {
      method: 'POST',
      body: {
        path: filepath,
        data: data.toString('base64'),
        encoding: 'base64',
      },
    })
  }
  catch (error) {
    throw new Error(`Failed to save QR code to file: ${error.message}`)
  }
}

/**
 * Validates QR content for server-side use
 * @param {string} content - Content to validate
 * @returns {Object} Validation result
 */
export const validateQRForServer = (content) => {
  try {
    return validateQRContent(content)
  }
  catch (error) {
    return {
      isValid: false,
      error: error.message,
      warnings: [],
      contentType: 'text',
      estimatedSize: 0,
    }
  }
}

/**
 * Formats content for server-side QR generation
 * @param {string} content - Content to format
 * @param {string} type - Content type
 * @returns {string} Formatted content
 */
export const formatQRForServer = (content, type) => {
  try {
    return formatQRContent(content, type)
  }
  catch (error) {
    return content // Return original if formatting fails
  }
}
