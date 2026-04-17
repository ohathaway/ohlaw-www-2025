// Admin: create a template from uploaded .docx
// or raw HTML. Detects {{field}} placeholders.
// Stores original .docx in blob for later
// docxtemplater field filling.

import { blob } from 'hub:blob'
import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import InspectModule
  from 'docxtemplater/js/inspect-module.js'
import { detectFields }
  from '../../../utils/esign/template-engine'

const { esignTemplates } = schema

const nanoid = () =>
  crypto.randomUUID().replace(/-/g, '')

// Extract {{fields}} from a DOCX buffer using
// docxtemplater's InspectModule
const detectDocxFields = (docxBuffer) => {
  const zip = new PizZip(docxBuffer)
  const iModule = new InspectModule()

  new Docxtemplater(zip, {
    modules: [iModule],
    delimiters: { start: '{{', end: '}}' },
  })
  const tags = iModule.getAllTags()
  return Object.keys(tags)
}

export default defineEventHandler(
  async (event) => {
    try {
      const body = await readBody(event)

      let name = body.name
      const description = body.description ?? ''
      let contentHtml = body.contentHtml
      let docxBuffer = null
      let fields = []

      // DOCX file as base64
      if (body.fileBase64) {
        docxBuffer = Buffer.from(
          body.fileBase64, 'base64',
        )

        // Detect fields from the DOCX directly
        fields = detectDocxFields(docxBuffer)

        // Generate minimal HTML for fallback
        // (field detection + signing page)
        contentHtml = '<p>Document template: '
          + (body.fileName ?? name ?? 'Template')
          + '</p>'

        if (!name) {
          name = (body.fileName ?? 'Template')
            .replace(/\.docx$/i, '')
        }
      }
      else {
        // HTML content — detect fields from HTML
        fields = detectFields(contentHtml ?? '')
      }

      if (!name) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Name is required',
        })
      }

      const id = nanoid()
      const now = new Date()

      // Store original DOCX in blob
      if (docxBuffer) {
        await blob.put(
          `esign/templates/${id}.docx`,
          new Uint8Array(docxBuffer),
          {
            contentType:
              'application/vnd.openxmlformats'
              + '-officedocument'
              + '.wordprocessingml.document',
          },
        )
      }

      await db.insert(esignTemplates).values({
        id,
        name,
        description,
        contentHtml: contentHtml || '',
        fields: JSON.stringify(fields),
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })

      const rows = await db
        .select()
        .from(esignTemplates)
        .where(eq(esignTemplates.id, id))
        .limit(1)

      return { template: rows[0] }
    }
    catch (err) {
      console.error('Template upload error:', err)
      throw createError({
        statusCode: err.statusCode ?? 500,
        statusMessage: err.message
          ?? 'Template upload failed',
      })
    }
  },
)
