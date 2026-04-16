import {
  sqliteTable,
  text,
  integer,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const esignFees = sqliteTable(
  'esign_fees',
  {
    id: text('id').primaryKey(),
    label: text('label').notNull(),
    filingFee: integer('filing_fee').notNull(),
    backgroundCheck: integer('background_check')
      .notNull(),
    createdAt: integer('created_at', {
      mode: 'timestamp',
    }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', {
      mode: 'timestamp',
    }).notNull().default(sql`(unixepoch())`),
  },
)
