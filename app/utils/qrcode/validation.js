/**
 * QR Code Content Validation Utilities
 * Validates and formats content for QR code generation
 */

/**
 * QR Code data capacity limits (approximate)
 * These are conservative estimates based on error correction level M
 */
export const QRCapacityLimits = {
  numeric: 7089,
  alphanumeric: 4296,
  byte: 2953,
  kanji: 1817,
}

/**
 * Common QR code content types
 */
export const QRContentTypes = {
  URL: 'url',
  EMAIL: 'email',
  PHONE: 'phone',
  SMS: 'sms',
  TEXT: 'text',
  WIFI: 'wifi',
  VCARD: 'vcard',
  LOCATION: 'location',
}

/**
 * Validates QR code content
 * @param {string} content - Content to validate
 * @returns {Object} Validation result with isValid, error, and warnings
 */
export const validateQRContent = (content) => {
  const result = {
    isValid: true,
    error: null,
    warnings: [],
    contentType: QRContentTypes.TEXT,
    estimatedSize: null,
  }

  // Check if content exists
  if (!content || typeof content !== 'string') {
    result.isValid = false
    result.error = 'Content must be a non-empty string'
    return result
  }

  // Check content length
  const contentLength = content.length
  if (contentLength > QRCapacityLimits.byte) {
    result.isValid = false
    result.error = `Content too long (${contentLength} characters). Maximum is ${QRCapacityLimits.byte} characters.`
    return result
  }

  // Set estimated size
  result.estimatedSize = contentLength

  // Detect content type and provide specific validation
  const contentType = detectContentType(content)
  result.contentType = contentType

  // Add warnings for long content
  if (contentLength > 1000) {
    result.warnings.push('Long content may result in dense QR codes that are difficult to scan')
  }

  if (contentLength > 500) {
    result.warnings.push('Consider using a shorter URL or text for better scanability')
  }

  // Type-specific validation
  switch (contentType) {
    case QRContentTypes.URL:
      validateURL(content, result)
      break
    case QRContentTypes.EMAIL:
      validateEmail(content, result)
      break
    case QRContentTypes.PHONE:
      validatePhone(content, result)
      break
    case QRContentTypes.SMS:
      validateSMS(content, result)
      break
  }

  return result
}

/**
 * Detects the type of QR code content
 * @param {string} content - Content to analyze
 * @returns {string} Content type
 */
export const detectContentType = (content) => {
  const lowerContent = content.toLowerCase()

  // URL detection
  if (lowerContent.startsWith('http://') || lowerContent.startsWith('https://')
    || lowerContent.startsWith('www.') || lowerContent.includes('://')) {
    return QRContentTypes.URL
  }

  // Email detection
  if (lowerContent.startsWith('mailto:')
    || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content)) {
    return QRContentTypes.EMAIL
  }

  // Phone detection
  if (lowerContent.startsWith('tel:')
    || /^[\+]?[\d\s\-\(\)]+$/.test(content)) {
    return QRContentTypes.PHONE
  }

  // SMS detection
  if (lowerContent.startsWith('sms:') || lowerContent.startsWith('smsto:')) {
    return QRContentTypes.SMS
  }

  // WiFi detection
  if (lowerContent.startsWith('wifi:')) {
    return QRContentTypes.WIFI
  }

  // vCard detection
  if (lowerContent.startsWith('begin:vcard')) {
    return QRContentTypes.VCARD
  }

  // Location detection
  if (lowerContent.startsWith('geo:') || lowerContent.includes('maps.google.com')) {
    return QRContentTypes.LOCATION
  }

  return QRContentTypes.TEXT
}

/**
 * Validates URL content
 * @param {string} content - URL to validate
 * @param {Object} result - Validation result object to modify
 */
const validateURL = (content, result) => {
  try {
    // Add protocol if missing
    let url = content
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.startsWith('www.')) {
        url = `https://${url}`
      }
      else if (!url.includes('://')) {
        url = `https://${url}`
      }
    }

    new URL(url)

    // Check for potentially unsafe URLs
    if (url.includes('javascript:') || url.includes('data:')) {
      result.warnings.push('URL contains potentially unsafe content')
    }
  }
  catch (error) {
    result.warnings.push('URL format may be invalid')
  }
}

/**
 * Validates email content
 * @param {string} content - Email to validate
 * @param {Object} result - Validation result object to modify
 */
const validateEmail = (content, result) => {
  let email = content

  // Remove mailto: prefix if present
  if (email.startsWith('mailto:')) {
    email = email.substring(7)
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    result.warnings.push('Email format may be invalid')
  }
}

/**
 * Validates phone content
 * @param {string} content - Phone number to validate
 * @param {Object} result - Validation result object to modify
 */
const validatePhone = (content, result) => {
  let phone = content

  // Remove tel: prefix if present
  if (phone.startsWith('tel:')) {
    phone = phone.substring(4)
  }

  // Remove common formatting characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')

  // Check if it's all numbers (with optional + prefix)
  if (!/^\+?\d+$/.test(cleanPhone)) {
    result.warnings.push('Phone number format may be invalid')
  }

  // Check length (international format can be 7-15 digits)
  if (cleanPhone.length < 7 || cleanPhone.length > 15) {
    result.warnings.push('Phone number length may be invalid')
  }
}

/**
 * Validates SMS content
 * @param {string} content - SMS content to validate
 * @param {Object} result - Validation result object to modify
 */
const validateSMS = (content, result) => {
  // SMS format: sms:+1234567890?body=Hello%20World
  if (!content.startsWith('sms:') && !content.startsWith('smsto:')) {
    result.warnings.push('SMS format should start with "sms:" or "smsto:"')
  }
}

/**
 * Formats content for specific QR code types
 * @param {string} content - Raw content
 * @param {string} type - Content type
 * @returns {string} Formatted content
 */
export const formatQRContent = (content, type) => {
  switch (type) {
    case QRContentTypes.URL:
      return formatURL(content)
    case QRContentTypes.EMAIL:
      return formatEmail(content)
    case QRContentTypes.PHONE:
      return formatPhone(content)
    case QRContentTypes.SMS:
      return formatSMS(content)
    default:
      return content
  }
}

/**
 * Formats URL for QR code
 * @param {string} url - URL to format
 * @returns {string} Formatted URL
 */
const formatURL = (url) => {
  // Add https:// if no protocol is specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.startsWith('www.')) {
      return `https://${url}`
    }
    else if (!url.includes('://')) {
      return `https://${url}`
    }
  }
  return url
}

/**
 * Formats email for QR code
 * @param {string} email - Email to format
 * @returns {string} Formatted email
 */
const formatEmail = (email) => {
  // Add mailto: prefix if not present
  if (!email.startsWith('mailto:')) {
    return `mailto:${email}`
  }
  return email
}

/**
 * Formats phone number for QR code
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
const formatPhone = (phone) => {
  // Add tel: prefix if not present
  if (!phone.startsWith('tel:')) {
    return `tel:${phone}`
  }
  return phone
}

/**
 * Formats SMS for QR code
 * @param {string} sms - SMS to format
 * @returns {string} Formatted SMS
 */
const formatSMS = (sms) => {
  // Add sms: prefix if not present
  if (!sms.startsWith('sms:') && !sms.startsWith('smsto:')) {
    return `sms:${sms}`
  }
  return sms
}

/**
 * Generates QR-friendly URLs with UTM parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} utmParams - UTM parameters
 * @returns {string} URL with UTM parameters
 */
export const generateTrackableURL = (baseUrl, utmParams = {}) => {
  const {
    source = 'qr-code',
    medium = 'qr',
    campaign = 'qr-campaign',
    content = null,
    term = null,
  } = utmParams

  const url = new URL(baseUrl)

  url.searchParams.set('utm_source', source)
  url.searchParams.set('utm_medium', medium)
  url.searchParams.set('utm_campaign', campaign)

  if (content) {
    url.searchParams.set('utm_content', content)
  }

  if (term) {
    url.searchParams.set('utm_term', term)
  }

  return url.toString()
}
