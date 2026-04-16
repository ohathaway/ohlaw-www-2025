// Admin: update a template's metadata
// and field mappings.

import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'

const { esignTemplates } = schema

export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    const rows = await db
      .select()
      .from(esignTemplates)
      .where(eq(esignTemplates.id, id))
      .limit(1)

    if (!rows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Template not found',
      })
    }

    const updates = { updatedAt: new Date() }

    if (body.name !== undefined) {
      updates.name = body.name
    }
    if (body.description !== undefined) {
      updates.description = body.description
    }
    if (body.fieldMappings !== undefined) {
      updates.fieldMappings
        = JSON.stringify(body.fieldMappings)
    }
    if (body.optionalFields !== undefined) {
      updates.optionalFields
        = JSON.stringify(body.optionalFields)
    }

    await db
      .update(esignTemplates)
      .set(updates)
      .where(eq(esignTemplates.id, id))

    const updated = await db
      .select()
      .from(esignTemplates)
      .where(eq(esignTemplates.id, id))
      .limit(1)

    return { template: updated[0] }
  },
)
