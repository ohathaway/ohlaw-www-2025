// Fill {{fields}} in a DOCX template buffer
// using docxtemplater. Returns a new DOCX
// buffer with fields replaced.

import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'

export const fillDocxTemplate = (
  docxBuffer,
  vars,
  optionalFields = [],
) => {
  const zip = new PizZip(docxBuffer)
  const doc = new Docxtemplater(zip, {
    delimiters: { start: '{{', end: '}}' },
    paragraphLoop: true,
    linebreaks: true,
    // Don't throw on missing fields —
    // optional fields may be blank
    nullGetter: (part) => {
      const field = part.value
      if (optionalFields.includes(field)) {
        return ''
      }
      return `{{${field}}}`
    },
  })

  doc.render(vars)

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  })

  return buf
}
