// Lodash array category utilities

/**
 * Creates a duplicate-free version of an array
 * @param {Array} array - The array to inspect
 * @returns {Array} Returns the new duplicate free array
 */
export const uniq = (array) => {
  if (!Array.isArray(array)) return []
  return [...new Set(array)]
}
