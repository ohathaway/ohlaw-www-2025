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
    const steps = []
    try {
      steps.push('readBody')
      const body = await readBody(event)

      let name = body.name
      let description = body.description ?? ''
      let contentHtml = body.contentHtml
      let docxBuffer = null

      if (body.fileBase64) {
        steps.push('decodeBase64')
        docxBuffer = Buffer.from(
          body.fileBase64, 'base64',
        )
        steps.push(`bufferSize:${docxBuffer.length}`)

        steps.push('mammoth')
        const result
          = await mammoth.convertToHtml(
            { buffer: docxBuffer },
          )
        contentHtml = result.value
        steps.push('mammothDone')

        if (!name) {
          name = (body.fileName ?? 'Template')
            .replace(/\.docx$/i, '')
        }
      }

      if (!name || !contentHtml) {
        return {
          error: true,
          step: 'validation',
          steps,
          detail: 'Name and content required',
        }
      }

      steps.push('detectFields')
      const fields = detectFields(contentHtml)
      const id = nanoid()
      const now = new Date()

      if (docxBuffer) {
        steps.push('blobPut')
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
        steps.push('blobDone')
      }

      steps.push('dbInsert')
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
      steps.push('dbDone')

      const rows = await db
        .select()
        .from(esignTemplates)
        .where(eq(esignTemplates.id, id))
        .limit(1)

      return { template: rows[0] }
    }
    catch (err) {
      console.error(
        'Template upload error at step:',
        steps,
        err,
      )
      return {
        error: true,
        steps,
        detail: err.message,
        stack: err.stack
          ?.split('\n').slice(0, 5),
      }
    }
  },
)
