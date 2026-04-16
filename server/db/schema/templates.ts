import {
  sqliteTable,
  text,
  integer,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const esignTemplates = sqliteTable(
  'esign_templates',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    contentHtml: text('content_html').notNull(),
    fields: text('fields').notNull(),
    fieldMappings: text('field_mappings'),
    optionalFields: text('optional_fields'),
    fieldPlacements: text('field_placements'),
    isActive: integer('is_active', {
      mode: 'boolean',
    }).notNull().default(true),
    createdAt: integer('created_at', {
      mode: 'timestamp',
    }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', {
      mode: 'timestamp',
    }).notNull().default(sql`(unixepoch())`),
  },
)
