export const toTitleCase = (phrase, delimiter = ' ') => {
  return phrase.toLowerCase().split(delimiter).map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

export const toKebobCase = (phrase, delimiter = ' ') => {
  return phrase.toLowerCase().replaceAll(delimiter, '-')
}

export const httpUrl = url => {
  return url.startsWith('http')
    ? url
    : `https://${url}`
}

/**
 * Validates a phone number input
 * @param {string|number} phoneNumber - The phone number to validate
 * @returns {string|null} Cleaned 10-digit string or null if invalid
 */
export const validatePhoneNumber = phoneNumber => {
  // Convert to string if number is passed
  const phoneStr = String(phoneNumber)
  
  // Remove any non-numeric characters
  const digits = phoneStr.replace(/\D/g, '')
  
  // Validate that we have exactly 10 digits
  if (digits.length !== 10) {
    return null
  }
  
  // Check that the string contains only digits
  if (!/^\d+$/.test(digits)) {
    return null
  }
  
  return digits
}

/**
 * Formats a phone number with dashes (xxx-xxx-xxxx)
 * @param {string|number} phoneNumber - The phone number to format
 * @returns {string|null} Formatted phone number or null if invalid
 */
export const formatPhoneNumberWithDashes = phoneNumber => {
  const digits = validatePhoneNumber(phoneNumber)
  if (!digits) return null
  
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

/**
 * Formats a phone number for use in tel: links (tel:+1xxxxxxxxxx)
 * @param {string|number} phoneNumber - The phone number to format
 * @returns {string|null} Formatted phone URL or null if invalid
 */
export const formatPhoneNumberForTel = phoneNumber => {
  const digits = validatePhoneNumber(phoneNumber)
  if (!digits) return null
  
  return `tel:+1${digits}`
}

/**
 * Formats a phone number for use in sms: links (sms://+1xxxxxxxxxx)
 * @param {string|number} phoneNumber - The phone number to format
 * @returns {string|null} Formatted phone URL or null if invalid
 */
export const formatPhoneNumberForSms = phoneNumber => {
  const digits = validatePhoneNumber(phoneNumber)
  if (!digits) return null
  
  return `sms://+1${digits}`
}