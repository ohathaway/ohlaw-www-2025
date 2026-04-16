// Bankruptcy fee lookup from D1.

import { db } from '@nuxthub/db'
import { eq } from 'drizzle-orm'
import { esignFees } from '../../db/schema/fees'

// Direct query — no auto-seed logic
const queryFee = async (id) => {
  const rows = await db
    .select()
    .from(esignFees)
    .where(eq(esignFees.id, id))
    .limit(1)
  return rows[0] ?? null
}

export const getFees = async (id) => {
  let fee = await queryFee(id)

  if (!fee) {
    await seedDefaultFees()
    fee = await queryFee(id)
  }

  return fee
}

export const getAllFees = async () => {
  return db.select().from(esignFees)
}

export const upsertFee = async (data) => {
  const existing = await queryFee(data.id)

  if (existing) {
    await db
      .update(esignFees)
      .set({
        label: data.label,
        filingFee: data.filingFee,
        backgroundCheck: data.backgroundCheck,
        updatedAt: new Date(),
      })
      .where(eq(esignFees.id, data.id))
  }
  else {
    await db.insert(esignFees).values({
      id: data.id,
      label: data.label,
      filingFee: data.filingFee,
      backgroundCheck: data.backgroundCheck,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  return queryFee(data.id)
}

// Seed default fees if the table is empty
export const seedDefaultFees = async () => {
  const existing = await getAllFees()
  if (existing.length) return existing

  const defaults = [
    {
      id: 'ch7_single',
      label: 'Chapter 7 — Individual',
      filingFee: 338,
      backgroundCheck: 38,
    },
    {
      id: 'ch7_joint',
      label: 'Chapter 7 — Joint',
      filingFee: 338,
      backgroundCheck: 38,
    },
    {
      id: 'ch13_single',
      label: 'Chapter 13 — Individual',
      filingFee: 313,
      backgroundCheck: 35,
    },
    {
      id: 'ch13_joint',
      label: 'Chapter 13 — Joint',
      filingFee: 313,
      backgroundCheck: 35,
    },
  ]

  const now = new Date()
  await db.insert(esignFees).values(
    defaults.map(d => ({
      ...d,
      createdAt: now,
      updatedAt: now,
    })),
  )

  return getAllFees()
}
