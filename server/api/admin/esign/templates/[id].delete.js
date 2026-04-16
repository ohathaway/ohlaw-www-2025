// Admin: delete a template.

import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'

const { esignTemplates } = schema

export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    await db
      .delete(esignTemplates)
      .where(eq(esignTemplates.id, id))

    return { success: true }
  },
)
