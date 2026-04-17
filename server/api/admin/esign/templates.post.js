// Admin: create a template from uploaded .docx
// or raw HTML. Detects {{field}} placeholders.
// Stores original .docx in blob for later
// docxtemplater field filling.
//
// Accepts JSON body with base64-encoded file
// (avoids multipart parsing issues in Workers):
// { name, description, fileName, fileBase64 }
// or plain HTML:
// { name, description, contentHtml }

import { blob } from 'hub:blob'
import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'
import mammoth from 'mammoth'
import { detectFields }
  from '../../../utils/esign/template-engine'

const { esignTemplates } = schema

const nanoid = () =>
  crypto.randomUUID().replace(/-/g, '')

export default defineEventHandler(
  async (event) => {
    try {
      const body = await readBody(event)

      let name = body.name
      let description = body.description ?? ''
      let contentHtml = body.contentHtml
      let docxBuffer = null

      // DOCX file as base64
      if (body.fileBase64) {
        docxBuffer = Buffer.from(
          body.fileBase64, 'base64',
        )

        const result
          = await mammoth.convertToHtml(
            { buffer: docxBuffer },
          )
        contentHtml = result.value

        if (!name) {
          name = (body.fileName ?? 'Template')
            .replace(/\.docx$/i, '')
        }
      }

      if (!name || !contentHtml) {
        throw createError({
          statusCode: 400,
          statusMessage:
            'Name and content are required',
        })
      }

      const fields = detectFields(contentHtml)
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
        contentHtml,
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
