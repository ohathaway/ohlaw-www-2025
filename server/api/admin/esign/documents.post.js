// Admin: create a new e-sign document.
// Supports DB templates (DOCX pipeline),
// legacy hardcoded templates, or ad hoc HTML.
//
// DOCX pipeline:
//   1. Fetch template .docx from blob
//   2. docxtemplater fills {{fields}}
//   3. External service converts to PDF
//   4. Store PDF + filled DOCX in blob
//
// Fallback: pdf-lib renders HTML to PDF

import { blob } from 'hub:blob'
import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'
import { createDocument }
  from '../../../utils/esign/db'
import { fillTemplate }
  from '../../../utils/esign/template-engine'
import { fillDocxTemplate }
  from '../../../utils/esign/docx-filler'
import { convertDocxToPdf }
  from '../../../utils/esign/pdf-converter'
import {
  renderTemplate,
  TEMPLATE_TYPES,
} from '../../../utils/esign/templates'
import { generateDocumentPdf }
  from '../../../utils/esign/document-pdf'

const { esignTemplates } = schema

export default defineEventHandler(
  async (event) => {
    const body = await readBody(event)

    if (!body.title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title is required',
      })
    }

    let contentHtml = body.contentHtml
    let pdfBytes = null
    const templateVars
      = body.templateVars ?? null

    // DB template — DOCX pipeline
    if (body.templateId) {
      const rows = await db
        .select()
        .from(esignTemplates)
        .where(
          eq(esignTemplates.id, body.templateId),
        )
        .limit(1)

      if (!rows.length) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Template not found',
        })
      }

      if (!templateVars) {
        throw createError({
          statusCode: 400,
          statusMessage:
            'Template variables are required',
        })
      }

      const tmpl = rows[0]
      const optional = tmpl.optionalFields
        ? JSON.parse(tmpl.optionalFields)
        : []

      // Fill HTML for fallback viewer
      contentHtml = fillTemplate(
        tmpl.contentHtml,
        templateVars,
        optional,
      )

      // Try DOCX pipeline
      try {
        const docxBlob = await blob.get(
          `esign/templates/${body.templateId}.docx`,
        )

        if (docxBlob) {
          const docxBuffer = Buffer.from(
            await docxBlob.arrayBuffer(),
          )

          // Fill {{fields}} in DOCX
          const filledDocx = fillDocxTemplate(
            docxBuffer,
            templateVars,
            optional,
          )

          // Convert to PDF via external service
          const pdfBuffer
            = await convertDocxToPdf(filledDocx)
          pdfBytes = pdfBuffer

          // Store filled DOCX as backup
          const document = await createDocument({
            title: body.title,
            templateType: body.templateId,
            templateVars,
            contentHtml,
            signerCount: body.signerCount ?? 1,
          })

          await blob.put(
            `esign/filled/${document.id}.docx`,
            new Uint8Array(filledDocx),
            {
              contentType:
                'application/vnd.openxmlformats'
                + '-officedocument'
                + '.wordprocessingml.document',
            },
          )

          // Store unsigned PDF
          await blob.put(
            `esign/unsigned/${document.id}.pdf`,
            new Uint8Array(pdfBytes),
            { contentType: 'application/pdf' },
          )

          return { document }
        }
      }
      catch (err) {
        console.error(
          'DOCX pipeline failed, falling back'
          + ' to HTML renderer:',
          err.message,
        )
        // Fall through to pdf-lib fallback
      }
    }
    // Legacy hardcoded templates
    else if (
      body.templateType
      && body.templateType !== 'adhoc'
      && TEMPLATE_TYPES[body.templateType]
    ) {
      if (!templateVars) {
        throw createError({
          statusCode: 400,
          statusMessage:
            'Template variables are required',
        })
      }

      contentHtml = await renderTemplate(
        body.templateType,
        templateVars,
      )
    }

    if (!contentHtml) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Document content '
          + 'or template is required',
      })
    }

    // Fallback: generate PDF from HTML
    if (!pdfBytes) {
      const bytes = await generateDocumentPdf(
        body.title,
        contentHtml,
      )
      pdfBytes = bytes
    }

    const document = await createDocument({
      title: body.title,
      templateType:
        body.templateId ?? body.templateType,
      templateVars,
      contentHtml,
      signerCount: body.signerCount ?? 1,
    })

    await blob.put(
      `esign/unsigned/${document.id}.pdf`,
      new Uint8Array(pdfBytes),
      { contentType: 'application/pdf' },
    )

    return { document }
  },
)
