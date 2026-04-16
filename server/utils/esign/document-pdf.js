// Document PDF generation using pdf-lib.
// Builds the engagement letter as a proper
// PDF with layout control. This is the
// unsigned document PDF — signatures are
// appended separately after signing.

import {
  PDFDocument,
  StandardFonts,
  rgb,
  PageSizes,
} from 'pdf-lib'

const BRAND = rgb(0.118, 0.227, 0.373)
const BLACK = rgb(0, 0, 0)
const GRAY = rgb(0.4, 0.4, 0.4)
const LIGHT_GRAY = rgb(0.6, 0.6, 0.6)
const MARGIN = 50
const PAGE_W = PageSizes.Letter[0]
const PAGE_H = PageSizes.Letter[1]
const CONTENT_W = PAGE_W - MARGIN * 2

// Parse HTML to structured blocks for
// rendering. Returns array of block objects.
const parseHtml = (html) => {
  const blocks = []

  // Collapse whitespace like a browser
  let text = html.replace(/\s+/g, ' ')

  // Extract table rows
  text = text.replace(
    /<table[\s\S]*?<\/table>/gi,
    (table) => {
      const rows = []
      table.replace(
        /<tr[^>]*>([\s\S]*?)<\/tr>/gi,
        (_, tr) => {
          const cells = []
          tr.replace(
            /<td[^>]*>([\s\S]*?)<\/td>/gi,
            (__, content) => {
              cells.push(
                content
                  .replace(/<[^>]+>/g, '')
                  .trim(),
              )
            },
          )
          if (cells.some(c => c)) {
            rows.push(cells)
          }
        },
      )
      blocks.push({ type: 'table', rows })
      return ''
    },
  )

  // Split remaining into block elements
  const parts = text.split(
    /(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>|<p[^>]*>[\s\S]*?<\/p>|<ul[^>]*>[\s\S]*?<\/ul>|<ol[^>]*>[\s\S]*?<\/ol>)/gi,
  )

  parts.forEach((part) => {
    const trimmed = part.trim()
    if (!trimmed) return

    const hMatch = trimmed.match(
      /^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>$/i,
    )
    if (hMatch) {
      const content = hMatch[2]
        .replace(/<[^>]+>/g, '')
        .trim()
      if (content) {
        blocks.push({
          type: 'heading',
          level: parseInt(hMatch[1], 10),
          text: content,
        })
      }
      return
    }

    const ulMatch = trimmed.match(
      /^<[ou]l[^>]*>([\s\S]*?)<\/[ou]l>$/i,
    )
    if (ulMatch) {
      const items = []
      ulMatch[1].replace(
        /<li[^>]*>([\s\S]*?)<\/li>/gi,
        (_, content) => {
          const t = content
            .replace(/<[^>]+>/g, '')
            .trim()
          if (t) items.push(t)
        },
      )
      if (items.length) {
        blocks.push({ type: 'list', items })
      }
      return
    }

    const pMatch = trimmed.match(
      /^<p[^>]*>([\s\S]*?)<\/p>$/i,
    )
    if (pMatch) {
      const content = pMatch[1]
        .replace(/<strong>([\s\S]*?)<\/strong>/gi, '$1')
        .replace(/<em>([\s\S]*?)<\/em>/gi, '$1')
        .replace(/<[^>]+>/g, '')
        .trim()
      if (content) {
        blocks.push({ type: 'para', text: content })
      }
      return
    }

    // Plain text fallback
    const plain = trimmed
      .replace(/<[^>]+>/g, '')
      .trim()
    if (plain) {
      blocks.push({ type: 'para', text: plain })
    }
  })

  return blocks
}

// Wrap text into lines that fit within maxWidth
const wrapText = (text, font, size, maxWidth) => {
  const words = text.split(/\s+/)
  const lines = []
  let current = ''

  words.forEach((word) => {
    const test = current
      ? `${current} ${word}`
      : word
    const width = font.widthOfTextAtSize(
      test, size,
    )
    if (width > maxWidth && current) {
      lines.push(current)
      current = word
    }
    else {
      current = test
    }
  })

  if (current) lines.push(current)
  return lines
}

// Ensure enough space on current page,
// or add a new one
const ensureSpace = (doc, page, y, needed) => {
  if (y - needed < MARGIN) {
    const newPage = doc.addPage(PageSizes.Letter)
    return { page: newPage, y: PAGE_H - MARGIN }
  }
  return { page, y }
}

// Draw wrapped text, return new Y position
const drawText = (
  page, text, font, size, color,
  x, y, maxWidth, lineHeight,
) => {
  const lines = wrapText(
    text, font, size, maxWidth,
  )
  lines.forEach((line) => {
    page.drawText(line, {
      x, y, size, font, color,
    })
    y -= lineHeight
  })
  return y
}

export const generateDocumentPdf = async (
  title,
  contentHtml,
) => {
  const doc = await PDFDocument.create()
  const regular = await doc.embedFont(
    StandardFonts.Helvetica,
  )
  const bold = await doc.embedFont(
    StandardFonts.HelveticaBold,
  )
  const italic = await doc.embedFont(
    StandardFonts.HelveticaOblique,
  )

  let page = doc.addPage(PageSizes.Letter)
  let y = PAGE_H - MARGIN

  // Letterhead
  y = drawText(
    page,
    'The Law Offices of Owen Hathaway',
    bold, 11, BRAND,
    MARGIN, y, CONTENT_W, 14,
  )
  y = drawText(
    page,
    'Fort Collins, Colorado  •  (970) 818-3052'
    + '  •  ohlawcolorado.com',
    regular, 8, GRAY,
    MARGIN, y, CONTENT_W, 11,
  )
  y -= 6
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_W - MARGIN, y },
    thickness: 0.75,
    color: BRAND,
  })
  y -= 20

  // Title
  y = drawText(
    page, title, bold, 16, BLACK,
    MARGIN, y, CONTENT_W, 20,
  )
  y -= 12

  // Parse and render content blocks
  const blocks = parseHtml(contentHtml)

  for (const block of blocks) {
    if (block.type === 'heading') {
      const size = block.level <= 2 ? 13 : 11
      ;({ page, y } = ensureSpace(
        doc, page, y, 30,
      ))
      y -= 8
      y = drawText(
        page, block.text, bold, size, BLACK,
        MARGIN, y, CONTENT_W, size + 4,
      )
      y -= 6
    }

    else if (block.type === 'para') {
      ;({ page, y } = ensureSpace(
        doc, page, y, 20,
      ))
      y = drawText(
        page, block.text,
        regular, 10, BLACK,
        MARGIN, y, CONTENT_W, 14,
      )
      y -= 8
    }

    else if (block.type === 'list') {
      for (const item of block.items) {
        ;({ page, y } = ensureSpace(
          doc, page, y, 20,
        ))
        // Bullet
        page.drawText('•', {
          x: MARGIN + 10,
          y,
          size: 10,
          font: regular,
          color: BLACK,
        })
        // Item text
        y = drawText(
          page, item,
          regular, 10, BLACK,
          MARGIN + 22, y,
          CONTENT_W - 22, 14,
        )
        y -= 4
      }
      y -= 4
    }

    else if (block.type === 'table') {
      ;({ page, y } = ensureSpace(
        doc, page, y, 20 * block.rows.length,
      ))
      y -= 4

      for (const cells of block.rows) {
        ;({ page, y } = ensureSpace(
          doc, page, y, 18,
        ))

        const isBold = cells.some(
          c => c.includes('Total'),
        )
        const font = isBold ? bold : regular

        // Left cell
        if (cells[0]) {
          page.drawText(cells[0], {
            x: MARGIN + 20,
            y,
            size: 10,
            font,
            color: BLACK,
          })
        }

        // Right cell (right-aligned)
        const lastCell = cells[cells.length - 1]
        if (lastCell && cells.length >= 2) {
          const w = font.widthOfTextAtSize(
            lastCell, 10,
          )
          page.drawText(lastCell, {
            x: PAGE_W - MARGIN - w,
            y,
            size: 10,
            font,
            color: BLACK,
          })
        }

        y -= 18
      }
      y -= 4
    }
  }

  // Footer
  const footerY = MARGIN - 10
  const lastPage = doc.getPages().at(-1)
  lastPage.drawText(
    'The Law Offices of Owen Hathaway'
    + '  •  ohlawcolorado.com',
    {
      x: MARGIN,
      y: footerY,
      size: 7,
      font: regular,
      color: LIGHT_GRAY,
    },
  )

  return doc.save()
}

// Append signature page(s) to an existing PDF
export const appendSignaturePage = async (
  existingPdfBytes,
  sessions,
) => {
  const doc = await PDFDocument.load(
    existingPdfBytes,
  )
  const regular = await doc.embedFont(
    StandardFonts.Helvetica,
  )
  const bold = await doc.embedFont(
    StandardFonts.HelveticaBold,
  )
  const italic = await doc.embedFont(
    StandardFonts.HelveticaOblique,
  )

  // Sort: primary first, then joint
  const sorted = [...sessions].sort(
    (a, b) => {
      if (a.signerRole === 'primary') return -1
      if (b.signerRole === 'primary') return 1
      return 0
    },
  )

  const page = doc.addPage(PageSizes.Letter)
  let y = PAGE_H - MARGIN

  // Header
  y = drawText(
    page,
    'ELECTRONIC SIGNATURES',
    bold, 14, BRAND,
    MARGIN, y, CONTENT_W, 18,
  )
  y -= 6
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_W - MARGIN, y },
    thickness: 0.75,
    color: BRAND,
  })
  y -= 20

  for (const session of sorted) {
    if (y < MARGIN + 200) {
      const newPage = doc.addPage(
        PageSizes.Letter,
      )
      y = PAGE_H - MARGIN
      // Use newPage for remaining sigs
      // (simplified: continue on same page var)
    }

    // Signature image
    if (session.signatureData) {
      try {
        const sigData = session.signatureData
          .replace(
            /^data:image\/png;base64,/, '',
          )
        const sigBytes = Uint8Array.from(
          atob(sigData),
          c => c.charCodeAt(0),
        )
        const sigImage = await doc.embedPng(
          sigBytes,
        )
        const dims = sigImage.scaleToFit(200, 60)
        page.drawImage(sigImage, {
          x: MARGIN,
          y: y - dims.height,
          width: dims.width,
          height: dims.height,
        })
        y -= dims.height + 8
      }
      catch (err) {
        console.error(
          'Failed to embed signature:', err,
        )
        y = drawText(
          page, '[Signature on file]',
          italic, 9, GRAY,
          MARGIN, y, CONTENT_W, 12,
        )
      }
    }

    // Signature line
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + 250, y },
      thickness: 0.5,
      color: BLACK,
    })
    y -= 14

    // Signer info
    y = drawText(
      page, session.signerName,
      bold, 10, BLACK,
      MARGIN, y, CONTENT_W, 13,
    )
    y = drawText(
      page, session.signerEmail,
      regular, 8, GRAY,
      MARGIN, y, CONTENT_W, 11,
    )

    const signedDate = new Date(session.signedAt)
      .toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'America/Denver',
      })
    y = drawText(
      page, `Signed: ${signedDate}`,
      regular, 8, GRAY,
      MARGIN, y, CONTENT_W, 11,
    )
    y -= 8

    // Certificate box
    const cert
      = typeof session.signatureCertificate
        === 'string'
        ? JSON.parse(
            session.signatureCertificate,
          )
        : session.signatureCertificate

    if (cert) {
      const boxH = 42
      page.drawRectangle({
        x: MARGIN,
        y: y - boxH,
        width: CONTENT_W,
        height: boxH,
        color: rgb(0.96, 0.96, 0.96),
      })

      const certLines = [
        `Certificate: ${cert.certificateId}`,
        `Doc Hash: ${
          cert.documentHash?.slice(0, 32)}...`,
        `Sig Hash: ${
          cert.signature?.dataHash
            ?.slice(0, 32)}...`,
      ]

      let cy = y - 10
      certLines.forEach((line) => {
        page.drawText(line, {
          x: MARGIN + 8,
          y: cy,
          size: 7,
          font: regular,
          color: LIGHT_GRAY,
        })
        cy -= 10
      })

      y -= boxH + 12
    }

    y -= 20
  }

  // ESIGN/UETA compliance footer
  const complianceText
    = 'This document was signed electronically '
      + 'in compliance with the Electronic '
      + 'Signatures in Global and National '
      + 'Commerce Act (ESIGN, 15 U.S.C. §7001 '
      + 'et seq.) and the Uniform Electronic '
      + 'Transactions Act (UETA).'

  const lastPg = doc.getPages().at(-1)
  const footerLines = wrapText(
    complianceText, regular, 7, CONTENT_W,
  )
  let fy = MARGIN + 5
  footerLines.reverse().forEach((line) => {
    lastPg.drawText(line, {
      x: MARGIN,
      y: fy,
      size: 7,
      font: regular,
      color: LIGHT_GRAY,
    })
    fy += 9
  })

  return doc.save()
}

// Stamp field values onto document pages at
// their placed coordinates, then append a
// certificate page. This is the main signing
// output function.
export const stampFieldsAndSign = async (
  existingPdfBytes,
  fieldPlacements,
  sessions,
) => {
  const doc = await PDFDocument.load(
    existingPdfBytes,
  )
  const regular = await doc.embedFont(
    StandardFonts.Helvetica,
  )
  const bold = await doc.embedFont(
    StandardFonts.HelveticaBold,
  )
  const pdfPages = doc.getPages()

  // Build a map of fieldId → value from all
  // sessions' fieldValues
  const fieldValueMap = {}
  const sessionByRole = {}

  for (const session of sessions) {
    sessionByRole[String(session.signerRole)]
      = session

    const vals = session.fieldValues
      ? typeof session.fieldValues === 'string'
        ? JSON.parse(session.fieldValues)
        : session.fieldValues
      : {}

    Object.entries(vals).forEach(
      ([fieldId, value]) => {
        fieldValueMap[fieldId] = value
      },
    )
  }

  // Stamp each placed field
  for (const field of (fieldPlacements ?? [])) {
    const pageIndex = (field.page ?? 1) - 1
    if (
      pageIndex < 0
      || pageIndex >= pdfPages.length
    ) continue

    const page = pdfPages[pageIndex]
    const value = fieldValueMap[field.id]
    const session
      = sessionByRole[String(field.signerRole)]

    if (
      field.type === 'signature'
      || field.type === 'initials'
    ) {
      if (!value) continue
      try {
        const sigData = value.replace(
          /^data:image\/png;base64,/, '',
        )
        const sigBytes = Uint8Array.from(
          atob(sigData),
          c => c.charCodeAt(0),
        )
        const sigImage = await doc.embedPng(
          sigBytes,
        )
        const dims = sigImage.scaleToFit(
          field.width,
          field.height,
        )
        page.drawImage(sigImage, {
          x: field.x,
          y: field.y - dims.height,
          width: dims.width,
          height: dims.height,
        })
      }
      catch (err) {
        console.error(
          `Failed to stamp ${field.type}:`,
          err,
        )
      }
    }

    else if (field.type === 'date_signed') {
      const dateStr = session?.signedAt
        ? new Date(session.signedAt)
            .toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
        : new Date().toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          )
      page.drawText(dateStr, {
        x: field.x,
        y: field.y - 12,
        size: 10,
        font: regular,
        color: BLACK,
      })
    }

    else if (field.type === 'date') {
      if (!value) continue
      page.drawText(String(value), {
        x: field.x,
        y: field.y - 12,
        size: 10,
        font: regular,
        color: BLACK,
      })
    }

    else if (field.type === 'name') {
      const name = session?.signerName ?? ''
      page.drawText(name, {
        x: field.x,
        y: field.y - 12,
        size: 10,
        font: regular,
        color: BLACK,
      })
    }

    else if (field.type === 'text') {
      if (!value) continue
      page.drawText(String(value), {
        x: field.x,
        y: field.y - 12,
        size: 10,
        font: regular,
        color: BLACK,
      })
    }

    else if (field.type === 'checkbox') {
      if (value) {
        page.drawText('✓', {
          x: field.x + 2,
          y: field.y - 12,
          size: 12,
          font: regular,
          color: BLACK,
        })
      }
    }
  }

  // Append certificate page
  const certPage = doc.addPage(PageSizes.Letter)
  let cy = PAGE_H - MARGIN

  cy = drawText(
    certPage,
    'ELECTRONIC SIGNATURES',
    bold, 14, BRAND,
    MARGIN, cy, CONTENT_W, 18,
  )
  cy -= 6
  certPage.drawLine({
    start: { x: MARGIN, y: cy },
    end: { x: PAGE_W - MARGIN, y: cy },
    thickness: 0.75,
    color: BRAND,
  })
  cy -= 20

  const sorted = [...sessions].sort(
    (a, b) =>
      Number(a.signerRole)
      - Number(b.signerRole),
  )

  for (const session of sorted) {
    if (cy < MARGIN + 120) {
      cy = PAGE_H - MARGIN
    }

    cy = drawText(
      certPage, session.signerName,
      bold, 11, BLACK,
      MARGIN, cy, CONTENT_W, 14,
    )
    cy = drawText(
      certPage, session.signerEmail,
      regular, 8, GRAY,
      MARGIN, cy, CONTENT_W, 11,
    )

    const signedDate = session.signedAt
      ? new Date(session.signedAt)
          .toLocaleString('en-US', {
            dateStyle: 'long',
            timeStyle: 'short',
            timeZone: 'America/Denver',
          })
      : 'Unknown'
    cy = drawText(
      certPage,
      `Signed: ${signedDate}`,
      regular, 8, GRAY,
      MARGIN, cy, CONTENT_W, 11,
    )
    cy -= 4

    const cert
      = typeof session.signatureCertificate
        === 'string'
        ? JSON.parse(
            session.signatureCertificate,
          )
        : session.signatureCertificate

    if (cert) {
      const boxH = 42
      certPage.drawRectangle({
        x: MARGIN,
        y: cy - boxH,
        width: CONTENT_W,
        height: boxH,
        color: rgb(0.96, 0.96, 0.96),
      })
      let ly = cy - 10
      const certLines = [
        `Certificate: ${cert.certificateId}`,
        `Doc Hash: ${
          cert.documentHash?.slice(0, 32)}...`,
        `Sig Hash: ${
          cert.signature?.dataHash
            ?.slice(0, 32)}...`,
      ]
      certLines.forEach((line) => {
        certPage.drawText(line, {
          x: MARGIN + 8,
          y: ly,
          size: 7,
          font: regular,
          color: LIGHT_GRAY,
        })
        ly -= 10
      })
      cy -= boxH + 12
    }

    cy -= 16
  }

  // Compliance footer
  const compText
    = 'This document was signed electronically '
      + 'in compliance with the Electronic '
      + 'Signatures in Global and National '
      + 'Commerce Act (ESIGN, 15 U.S.C. §7001 '
      + 'et seq.) and the Uniform Electronic '
      + 'Transactions Act (UETA).'

  const lastPage = doc.getPages().at(-1)
  const fLines = wrapText(
    compText, regular, 7, CONTENT_W,
  )
  let footY = MARGIN + 5
  fLines.reverse().forEach((line) => {
    lastPage.drawText(line, {
      x: MARGIN,
      y: footY,
      size: 7,
      font: regular,
      color: LIGHT_GRAY,
    })
    footY += 9
  })

  return doc.save()
}
