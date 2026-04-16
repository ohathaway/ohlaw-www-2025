// Template field detection and rendering.
// Scans HTML for {{fieldName}} placeholders
// and replaces them with provided values.

// Extract unique field names from {{...}}
// placeholders in HTML content
export const detectFields = (html) => {
  const matches = html.match(
    /\{\{(\w+)\}\}/g,
  ) ?? []

  const fields = [
    ...new Set(
      matches.map(m =>
        m.replace(/\{\{|\}\}/g, ''),
      ),
    ),
  ]

  return fields
}

// Replace {{fieldName}} placeholders with
// values from the provided vars object.
// Throws only if required fields are missing.
// optionalFields is an array of field names
// that can be left blank.
export const fillTemplate = (
  html,
  vars,
  optionalFields = [],
) => {
  const fields = detectFields(html)
  const optional = new Set(optionalFields)

  const missing = fields.filter(
    f =>
      !optional.has(f)
      && !vars[f]
      && vars[f] !== 0,
  )

  if (missing.length) {
    throw new Error(
      `Missing template fields: `
      + missing.join(', '),
    )
  }

  return html.replace(
    /\{\{(\w+)\}\}/g,
    (_, field) => vars[field] ?? '',
  )
}
