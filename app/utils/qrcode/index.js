/**
 * QR Code System - Main Export
 * Universal QR code generation for Nuxt 4.0 with OH Law branding
 * Works seamlessly in both client and server environments
 */

// Core utilities
export {
  createStyledQRCode,
  generateQRCode,
  generateQRDataURL,
  generateQRSVG,
  generateQRForPDF,
  batchGenerateQRCodes,
  getAvailablePresets,
  getAvailableSizes,
  getAvailableFormats,
} from './generator.js'

// Configuration
export {
  OHLawColors,
  QRStylePresets,
  DefaultQRConfig,
  OutputFormats,
  SizePresets,
  ErrorCorrectionLevels,
} from './config.js'

// Validation utilities
export {
  validateQRContent,
  detectContentType,
  formatQRContent,
  generateTrackableURL,
  QRContentTypes,
  QRCapacityLimits,
} from './validation.js'

/**
 * Quick QR code generation with OH Law defaults
 * @param {string} content - Content to encode
 * @param {Object} options - Optional configuration
 * @returns {Promise<string>} QR code as data URL
 */
export const quickQR = async (content, options = {}) => {
  const { generateQRDataURL } = await import('./generator.js')
  return generateQRDataURL(content, {
    preset: 'professional',
    size: 'medium',
    format: 'png',
    ...options,
  })
}

/**
 * Creates a contact QR code for OH Law
 * @param {Object} contactInfo - Contact information
 * @returns {Promise<string>} QR code as data URL
 */
export const createContactQR = async (contactInfo = {}) => {
  const appConfig = useAppConfig()

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

  const { generateQRDataURL } = await import('./generator.js')
  return generateQRDataURL(vcard, {
    preset: 'professional',
    size: 'medium',
    format: 'png',
  })
}

/**
 * Creates a WiFi QR code
 * @param {Object} wifiInfo - WiFi network information
 * @returns {Promise<string>} QR code as data URL
 */
export const createWiFiQR = async (wifiInfo) => {
  const { ssid, password, security = 'WPA', hidden = false } = wifiInfo

  if (!ssid || !password) {
    throw new Error('WiFi SSID and password are required')
  }

  const wifiString = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`

  const { generateQRDataURL } = await import('./generator.js')
  return generateQRDataURL(wifiString, {
    preset: 'professional',
    size: 'medium',
    format: 'png',
  })
}

/**
 * Creates a location QR code
 * @param {Object} locationInfo - Location information
 * @returns {Promise<string>} QR code as data URL
 */
export const createLocationQR = async (locationInfo) => {
  const { lat, lng, query } = locationInfo

  let locationString
  if (lat && lng) {
    locationString = `geo:${lat},${lng}`
    if (query) {
      locationString += `?q=${encodeURIComponent(query)}`
    }
  }
  else if (query) {
    locationString = `https://maps.google.com/maps?q=${encodeURIComponent(query)}`
  }
  else {
    throw new Error('Either coordinates (lat, lng) or query string is required')
  }

  const { generateQRDataURL } = await import('./generator.js')
  return generateQRDataURL(locationString, {
    preset: 'professional',
    size: 'medium',
    format: 'png',
  })
}

/**
 * Creates an OH Law office location QR code
 * @returns {Promise<string>} QR code as data URL
 */
export const createOHLawLocationQR = async () => {
  const appConfig = useAppConfig()

  const address = `${appConfig.seo.address.street}, ${appConfig.seo.address.city}, ${appConfig.seo.address.state} ${appConfig.seo.address.zip}`

  return createLocationQR({
    query: `${appConfig.seo.siteName} ${address}`,
  })
}

/**
 * Convenience function for common OH Law QR code types
 */
export const OHLawQRTypes = {
  contact: createContactQR,
  location: createOHLawLocationQR,
  wifi: createWiFiQR,
  quick: quickQR,
}
