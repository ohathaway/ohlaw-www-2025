/**
 * Number formatting utilities for financial calculations
 * Used throughout the SECURE 2.0 Impact Calculator and other tools
 */

/**
 * Formats a number as US currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "$1,234,567")
 */
export const formatCurrency = (amount) => {
  if (!amount) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats a decimal rate as a percentage
 * @param {number} rate - The decimal rate to format (e.g., 0.25 for 25%)
 * @returns {string} Formatted percentage string (e.g., "25.0%")
 */
export const formatPercent = (rate) => {
  return `${(rate * 100).toFixed(1)}%`
}

/**
 * Formats a number with thousands separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number string (e.g., "1,234,567")
 */
export const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Parses a currency string to a number
 * @param {string} currencyString - Currency string (e.g., "$1,234,567")
 * @returns {number} Parsed number value
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0
  return parseFloat(currencyString.replace(/[$,]/g, '')) || 0
}
