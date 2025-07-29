export const intersection = (...arrays) => {
  if (arrays.length === 0) return []
  return arrays.reduce((acc, arr) => acc.filter(x => arr.includes(x)))
}
