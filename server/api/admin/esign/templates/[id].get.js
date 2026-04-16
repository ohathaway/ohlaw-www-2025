// Admin: get a single template.

import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'

const { esignTemplates } = schema

export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

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

    return { template: rows[0] }
  },
)
