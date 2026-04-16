// Signed PDF generation using PDFKit.
// Combines document content + signature(s)
// + audit certificates into a final PDF.

import PDFDocument from 'pdfkit'

const BRAND_COLOR = '#1E3A5F'
const MARGIN = 50
const PAGE_WIDTH = 612
const PAGE_HEIGHT = 792
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const FONT = {
  body: 'app/assets/fonts/PlusJakartaSans-Regular.ttf',
  bold: 'app/assets/fonts/PlusJakartaSans-Bold.ttf',
  italic: 'app/assets/fonts/PlusJakartaSans-Italic.ttf',
}

const registerFonts = (doc) => {
  doc.registerFont('Body', FONT.body)
  doc.registerFont('Bold', FONT.bold)
  doc.registerFont('Italic', FONT.italic)
}

// Convert table rows to "label ... amount"
// tab-aligned lines
const convertTables = html =>
  html.replace(
    /<table[\s\S]*?<\/table>/gi,
    (table) => {
      const rows = []
      table.replace(
        /<tr[\s\S]*?<\/tr>/gi,
        (tr) => {
          const cells = []
          tr.replace(
            /<td[^>]*>([\s\S]*?)<\/td>/gi,
            (_, content) => {
              const text = content
                .replace(/<[^>]+>/g, '')
                .replace(/\s+/g, ' ')
                .trim()
              if (text) cells.push(text)
            },
          )
          if (cells.length >= 2) {
            rows.push(
              `  ${cells[0]}    ${cells[cells.length - 1]}`,
            )
          }
          else if (cells.length === 1) {
            rows.push(`  ${cells[0]}`)
          }
        },
      )
      return '\n' + rows.join('\n') + '\n'
    },
  )

// Strip HTML tags, decode entities, collapse
// whitespace for plain-text PDF rendering.
// Key: collapse ALL whitespace in the raw HTML
// first (like a browser does), then insert
// structural line breaks for block elements.
const htmlToPlainText = (html) => {
  let text = html
  // Remove scripts/styles
  text = text.replace(
    /<script[\s\S]*?<\/script>/gi, '')
  text = text.replace(
    /<style[\s\S]*?<\/style>/gi, '')
  // Convert tables before stripping tags
  text = convertTables(text)
  // Collapse ALL whitespace in the HTML source
  // (mimics browser behavior: newlines, tabs,
  // multiple spaces all become a single space)
  text = text.replace(/\s+/g, ' ')
  // Now insert structural line breaks
  text = text.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<\/p>/gi, '\n\n')
  text = text.replace(/<\/li>/gi, '\n')
  text = text.replace(/<li[^>]*>/gi, '  • ')
  text = text.replace(
    /<\/h[1-6]>/gi, '\n\n')
  text = text.replace(
    /<h[1-6][^>]*>/gi, '\n')
  text = text.replace(/<\/ol>/gi, '\n')
  text = text.replace(/<\/ul>/gi, '\n')
  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, '')
  // Decode entities
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#39;/g, '\'')
  text = text.replace(/&nbsp;/g, ' ')
  // Clean up: collapse multiple blank lines,
  // trim leading/trailing spaces on lines
  text = text.replace(/\n{3,}/g, '\n\n')
  text = text.split('\n')
    .map(line => line.trim())
    .join('\n')
  return text.trim()
}

const ensureSpace = (doc, needed) => {
  if (doc.y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage()
  }
}

const drawLetterhead = (doc) => {
  doc
    .font('Bold')
    .fontSize(11)
    .fillColor(BRAND_COLOR)
    .text(
      'The Law Offices of Owen Hathaway',
      MARGIN,
      MARGIN,
      { width: CONTENT_WIDTH },
    )
  doc
    .font('Body')
    .fontSize(8)
    .fillColor('#666')
    .text(
      'Fort Collins, Colorado'
      + '  •  (970) 818-3052'
      + '  •  ohlawcolorado.com',
    )
  doc
    .moveTo(MARGIN, doc.y + 8)
    .lineTo(PAGE_WIDTH - MARGIN, doc.y + 8)
    .strokeColor(BRAND_COLOR)
    .lineWidth(1)
    .stroke()
  doc.moveDown(2)
}

const drawDocumentBody = (doc, title, html) => {
  doc
    .font('Bold')
    .fontSize(16)
    .fillColor('#000')
    .text(title, { width: CONTENT_WIDTH })
  doc.moveDown(1)

  const body = htmlToPlainText(html)
  doc
    .font('Body')
    .fontSize(10)
    .fillColor('#333')
    .text(body, {
      width: CONTENT_WIDTH,
      lineGap: 3,
    })
}

const drawSignatureBlock = (doc, session) => {
  ensureSpace(doc, 200)

  // Divider
  doc.moveDown(1)
  doc
    .moveTo(MARGIN, doc.y)
    .lineTo(PAGE_WIDTH - MARGIN, doc.y)
    .strokeColor(BRAND_COLOR)
    .lineWidth(0.5)
    .stroke()
  doc.moveDown(1)

  doc
    .font('Bold')
    .fontSize(10)
    .fillColor(BRAND_COLOR)
    .text('ELECTRONIC SIGNATURE', {
      width: CONTENT_WIDTH,
    })
  doc.moveDown(0.5)

  // Signature image
  if (session.signatureData) {
    const sigData = session.signatureData
      .replace(/^data:image\/png;base64,/, '')
    const sigBuffer = Buffer.from(
      sigData,
      'base64',
    )

    try {
      doc.image(sigBuffer, doc.x, doc.y, {
        fit: [200, 60],
      })
      doc.moveDown(4)
    }
    catch (err) {
      console.error(
        'Failed to embed signature image:',
        err,
      )
      doc
        .font('Italic')
        .fontSize(9)
        .text('[Signature on file]')
      doc.moveDown(1)
    }
  }

  // Signer info
  doc
    .font('Bold')
    .fontSize(9)
    .fillColor('#000')
    .text(session.signerName)
  doc
    .font('Body')
    .fontSize(8)
    .fillColor('#666')
    .text(session.signerEmail)
  doc.text(
    `Signed: ${new Date(session.signedAt)
      .toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'America/Denver',
      })}`,
  )

  // Certificate box
  const cert = typeof session.signatureCertificate
    === 'string'
    ? JSON.parse(session.signatureCertificate)
    : session.signatureCertificate

  if (cert) {
    doc.moveDown(0.5)
    const boxY = doc.y
    doc
      .rect(
        MARGIN,
        boxY,
        CONTENT_WIDTH,
        48,
      )
      .fillColor('#f5f5f5')
      .fill()

    doc
      .font('Body')
      .fontSize(7)
      .fillColor('#999')
    doc.text(
      `Certificate: ${cert.certificateId}`,
      MARGIN + 8,
      boxY + 6,
      { width: CONTENT_WIDTH - 16 },
    )
    doc.text(
      `Doc Hash: ${cert.documentHash
        ?.slice(0, 32)}...`,
    )
    doc.text(
      `Sig Hash: ${cert.signature?.dataHash
        ?.slice(0, 32)}...`,
    )
  }
}

const drawComplianceFooter = (doc) => {
  const footerY = PAGE_HEIGHT - 60
  doc
    .font('Body')
    .fontSize(7)
    .fillColor('#999')
    .text(
      'This document was signed electronically '
      + 'in compliance with the Electronic '
      + 'Signatures in Global and National '
      + 'Commerce Act (ESIGN, 15 U.S.C. §7001 '
      + 'et seq.) and the Uniform Electronic '
      + 'Transactions Act (UETA).',
      MARGIN,
      footerY,
      { width: CONTENT_WIDTH, align: 'center' },
    )
}

export const generateSignedPdf = (
  document,
  sessions,
) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: {
        top: MARGIN,
        bottom: MARGIN,
        left: MARGIN,
        right: MARGIN,
      },
      info: {
        Title: document.title,
        Author: 'The Law Offices of Owen Hathaway',
        Subject: 'Signed Document',
        Creator: 'OHLaw E-Sign',
      },
    })

    const chunks = []
    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () =>
      resolve(Buffer.concat(chunks)),
    )
    doc.on('error', reject)

    try {
      registerFonts(doc)
      drawLetterhead(doc)
      drawDocumentBody(
        doc,
        document.title,
        document.contentHtml,
      )

      // Sort: primary first, then joint
      const sorted = [...sessions].sort(
        (a, b) => {
          if (a.signerRole === 'primary') return -1
          if (b.signerRole === 'primary') return 1
          return 0
        },
      )

      sorted.forEach(session =>
        drawSignatureBlock(doc, session),
      )

      drawComplianceFooter(doc)
      doc.end()
    }
    catch (err) {
      reject(err)
    }
  })
