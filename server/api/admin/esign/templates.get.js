// Admin: list all document templates.

import { db, schema } from '@nuxthub/db'
import { desc } from 'drizzle-orm'

const { esignTemplates } = schema

export default defineEventHandler(async () => {
  const templates = await db
    .select()
    .from(esignTemplates)
    .orderBy(desc(esignTemplates.createdAt))

  return { templates }
})
