// Lodash object category utilities

/**
 * Iterates over own enumerable string keyed properties of an object and invokes iteratee for each property
 * @param {Object} object - The object to iterate over
 * @param {Function} iteratee - The function invoked per iteration
 * @returns {Object} Returns object
 */
export const forOwn = (object, iteratee) => {
  if (object == null || typeof iteratee !== 'function') return object

  Object.entries(object).forEach(([key, value]) => {
    iteratee(value, key, object)
  })

  return object
}
