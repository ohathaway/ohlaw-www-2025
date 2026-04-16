import {
  sqliteTable,
  text,
  integer,
  index,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const esignDocuments = sqliteTable(
  'esign_documents',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    templateType: text('template_type'),
    templateVars: text('template_vars'),
    contentHtml: text('content_html').notNull(),
    status: text('status', {
      enum: [
        'DRAFT',
        'SENT',
        'COMPLETED',
        'VOIDED',
      ],
    }).notNull().default('DRAFT'),
    signerCount: integer('signer_count')
      .notNull()
      .default(1),
    fieldPlacements: text('field_placements'),
    signedPdfBlobKey: text('signed_pdf_blob_key'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  table => ({
    statusIdx: index('idx_esign_docs_status')
      .on(table.status),
    createdAtIdx: index('idx_esign_docs_created')
      .on(table.createdAt),
  }),
)
