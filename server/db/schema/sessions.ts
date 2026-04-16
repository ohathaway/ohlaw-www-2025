import {
  sqliteTable,
  text,
  integer,
  index,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { esignDocuments } from './documents'

export const esignSessions = sqliteTable(
  'esign_sessions',
  {
    id: text('id').primaryKey(),
    documentId: text('document_id')
      .notNull()
      .references(() => esignDocuments.id, {
        onDelete: 'cascade',
      }),
    signerName: text('signer_name').notNull(),
    signerEmail: text('signer_email').notNull(),
    signerRole: text('signer_role')
      .notNull()
      .default('1'),
    status: text('status', {
      enum: [
        'PENDING',
        'VIEWED',
        'SIGNED',
        'EXPIRED',
        'REVOKED',
      ],
    }).notNull().default('PENDING'),
    signingToken: text('signing_token').unique(),
    tokenExpiresAt: integer('token_expires_at', {
      mode: 'timestamp',
    }),
    viewedAt: integer('viewed_at', {
      mode: 'timestamp',
    }),
    signedAt: integer('signed_at', {
      mode: 'timestamp',
    }),
    signatureData: text('signature_data'),
    signatureHash: text('signature_hash'),
    fieldValues: text('field_values'),
    signatureCertificate: text('signature_certificate'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    geoCountry: text('geo_country'),
    geoRegion: text('geo_region'),
    geoCity: text('geo_city'),
    termsAcceptedAt: integer('terms_accepted_at', {
      mode: 'timestamp',
    }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  table => ({
    documentIdIdx: index('idx_esign_sess_doc')
      .on(table.documentId),
    tokenIdx: index('idx_esign_sess_token')
      .on(table.signingToken),
    statusIdx: index('idx_esign_sess_status')
      .on(table.status),
  }),
)
