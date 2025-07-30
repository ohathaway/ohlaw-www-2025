// Lodash lang category utilities

/**
 * Checks if value is empty. A value is considered empty if it's:
 * - null or undefined
 * - an empty string, array, or object
 * - a Map or Set with size 0
 * @param {*} value - The value to check
 * @returns {boolean} Returns true if value is empty, else false
 */
export const isEmpty = (value) => {
  if (value == null) return true

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}
