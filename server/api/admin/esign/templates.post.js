// Admin: create a template from uploaded .docx
// or raw HTML. Detects {{field}} placeholders.
// Stores original .docx in blob for later
// docxtemplater field filling.

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
      const contentType = getRequestHeader(
        event,
        'content-type',
      ) ?? ''

      let name, description, contentHtml
      let docxBuffer = null

      // Handle multipart (docx upload)
      if (contentType.includes('multipart')) {
        const formData
          = await readMultipartFormData(event)

        name = formData
          .find(f => f.name === 'name')
          ?.data?.toString()
        description = formData
          .find(f => f.name === 'description')
          ?.data?.toString() ?? ''

        const file = formData.find(
          f => f.name === 'file',
        )

        if (!file?.data) {
          throw createError({
            statusCode: 400,
            statusMessage: 'File is required',
          })
        }

        // Keep the original DOCX bytes
        docxBuffer = file.data

        // Convert to HTML for field detection
        // and signing page fallback viewer
        const result
          = await mammoth.convertToHtml(
            { buffer: docxBuffer },
          )
        contentHtml = result.value

        if (!name) {
          name = (file.filename ?? 'Template')
            .replace(/\.docx$/i, '')
        }
      }
      // Handle JSON (raw HTML)
      else {
        const body = await readBody(event)
        name = body.name
        description = body.description ?? ''
        contentHtml = body.contentHtml
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
        data: {
          detail: err.message,
          stack: err.stack?.split('\n').slice(0, 5),
        },
      })
    }
  },
)
