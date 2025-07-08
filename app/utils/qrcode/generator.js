/**
 * Universal QR Code Generator
 * Works in both client and server environments
 * Integrates with OH Law branding and design system
 */

import QRCodeStyling from 'qr-code-styling'
import {
  DefaultQRConfig,
  QRStylePresets,
  OutputFormats,
  SizePresets,
  ErrorCorrectionLevels,
} from './config.js'
import { validateQRContent } from './validation.js'

/**
 * Creates a styled QR code with OH Law branding
 * @param {string} content - The content to encode in the QR code
 * @param {Object} options - Configuration options
 * @param {string} options.preset - Style preset ('professional', 'success', 'warning', 'minimal', 'highContrast')
 * @param {string} options.size - Size preset ('small', 'medium', 'large', 'print', 'thumbnail')
 * @param {string} options.errorCorrectionLevel - Error correction level ('L', 'M', 'Q', 'H')
 * @param {Object} options.customStyle - Custom style overrides
 * @param {string} options.logo - Logo URL or base64 string
 * @returns {Object} QR code instance with OH Law styling
 */
export const createStyledQRCode = (content, options = {}) => {
  // Validate input content
  const validationResult = validateQRContent(content)
  if (!validationResult.isValid) {
    throw new Error(`Invalid QR content: ${validationResult.error}`)
  }

  // Set up configuration
  const {
    preset = 'professional',
    size = 'medium',
    errorCorrectionLevel = 'M',
    customStyle = {},
    logo = null,
  } = options

  // Get base configuration
  const baseConfig = { ...DefaultQRConfig }

  // Apply size preset
  if (SizePresets[size]) {
    baseConfig.width = SizePresets[size].width
    baseConfig.height = SizePresets[size].height
  }

  // Apply style preset
  if (QRStylePresets[preset]) {
    Object.assign(baseConfig, QRStylePresets[preset])
  }

  // Apply error correction level
  baseConfig.qrOptions.errorCorrectionLevel = errorCorrectionLevel

  // Apply custom style overrides
  if (customStyle.dotsOptions) {
    baseConfig.dotsOptions = { ...baseConfig.dotsOptions, ...customStyle.dotsOptions }
  }
  if (customStyle.backgroundOptions) {
    baseConfig.backgroundOptions = { ...baseConfig.backgroundOptions, ...customStyle.backgroundOptions }
  }
  if (customStyle.cornersSquareOptions) {
    baseConfig.cornersSquareOptions = { ...baseConfig.cornersSquareOptions, ...customStyle.cornersSquareOptions }
  }
  if (customStyle.cornersDotOptions) {
    baseConfig.cornersDotOptions = { ...baseConfig.cornersDotOptions, ...customStyle.cornersDotOptions }
  }

  // Add logo if provided
  if (logo) {
    baseConfig.image = logo
    baseConfig.imageOptions = {
      ...baseConfig.imageOptions,
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 5,
    }
  }

  // Create QR code instance
  const qrCode = new QRCodeStyling({
    ...baseConfig,
    data: content,
  })

  return qrCode
}

/**
 * Generates QR code and returns it in the specified format
 * @param {string} content - The content to encode
 * @param {Object} options - Configuration options
 * @param {string} options.format - Output format ('svg', 'png', 'jpeg', 'webp')
 * @returns {Promise<string|Buffer>} QR code in specified format
 */
export const generateQRCode = async (content, options = {}) => {
  const { format = OutputFormats.SVG, ...qrOptions } = options

  try {
    const qrCode = createStyledQRCode(content, qrOptions)

    switch (format.toLowerCase()) {
      case OutputFormats.SVG:
        return await qrCode.getRawData('svg')
      case OutputFormats.PNG:
        return await qrCode.getRawData('png')
      case OutputFormats.JPEG:
        return await qrCode.getRawData('jpeg')
      case OutputFormats.WEBP:
        return await qrCode.getRawData('webp')
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }
  catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`)
  }
}

/**
 * Generates QR code as a data URL for immediate use in HTML
 * @param {string} content - The content to encode
 * @param {Object} options - Configuration options
 * @returns {Promise<string>} Data URL string
 */
export const generateQRDataURL = async (content, options = {}) => {
  const { format = OutputFormats.PNG, ...qrOptions } = options

  try {
    const qrCode = createStyledQRCode(content, qrOptions)
    return await qrCode.toDataURL(format)
  }
  catch (error) {
    throw new Error(`Failed to generate QR data URL: ${error.message}`)
  }
}

/**
 * Generates QR code as an SVG string for immediate use
 * @param {string} content - The content to encode
 * @param {Object} options - Configuration options
 * @returns {Promise<string>} SVG string
 */
export const generateQRSVG = async (content, options = {}) => {
  try {
    const qrCode = createStyledQRCode(content, options)
    const svgData = await qrCode.getRawData('svg')

    // Convert Buffer to string if needed
    if (Buffer.isBuffer(svgData)) {
      return svgData.toString('utf8')
    }
    return svgData
  }
  catch (error) {
    throw new Error(`Failed to generate QR SVG: ${error.message}`)
  }
}

/**
 * Generates QR code for PDF inclusion (returns Buffer)
 * @param {string} content - The content to encode
 * @param {Object} options - Configuration options
 * @returns {Promise<Buffer>} PNG buffer for PDF embedding
 */
export const generateQRForPDF = async (content, options = {}) => {
  const pdfOptions = {
    format: OutputFormats.PNG,
    size: 'large',
    preset: 'highContrast', // Better for PDF printing
    ...options,
  }

  try {
    const qrCode = createStyledQRCode(content, pdfOptions)
    return await qrCode.getRawData('png')
  }
  catch (error) {
    throw new Error(`Failed to generate QR for PDF: ${error.message}`)
  }
}

/**
 * Batch generates multiple QR codes
 * @param {Array<{content: string, options: Object}>} items - Array of QR code specifications
 * @returns {Promise<Array>} Array of generated QR codes
 */
export const batchGenerateQRCodes = async (items) => {
  const results = []

  for (const item of items) {
    try {
      const qrCode = await generateQRCode(item.content, item.options)
      results.push({ success: true, data: qrCode, content: item.content })
    }
    catch (error) {
      results.push({ success: false, error: error.message, content: item.content })
    }
  }

  return results
}

/**
 * Gets available style presets
 * @returns {Array<string>} Array of available preset names
 */
export const getAvailablePresets = () => {
  return Object.keys(QRStylePresets)
}

/**
 * Gets available size presets
 * @returns {Array<string>} Array of available size preset names
 */
export const getAvailableSizes = () => {
  return Object.keys(SizePresets)
}

/**
 * Gets available output formats
 * @returns {Array<string>} Array of available format names
 */
export const getAvailableFormats = () => {
  return Object.values(OutputFormats)
}
