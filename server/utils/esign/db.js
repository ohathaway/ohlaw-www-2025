// Drizzle data access helpers for the e-sign
// system. Uses NuxtHub 0.10 db import.

import { db } from '@nuxthub/db'
import { eq, desc } from 'drizzle-orm'
import * as schema from '../../db/schema/index'

const {
  esignDocuments,
  esignSessions,
} = schema

export const useDrizzle = () => db

const nanoid = () =>
  crypto.randomUUID().replace(/-/g, '')

// --- Documents ---

export const createDocument = async (data) => {
  const now = new Date()
  const id = nanoid()

  await db.insert(esignDocuments).values({
    id,
    title: data.title,
    templateType: data.templateType ?? null,
    templateVars: data.templateVars
      ? JSON.stringify(data.templateVars)
      : null,
    contentHtml: data.contentHtml,
    status: 'DRAFT',
    signerCount: data.signerCount ?? 1,
    fieldPlacements: data.fieldPlacements
      ? JSON.stringify(data.fieldPlacements)
      : null,
    createdAt: now,
    updatedAt: now,
  })

  return getDocumentById(id)
}

export const getDocumentById = async (id) => {
  const rows = await db
    .select()
    .from(esignDocuments)
    .where(eq(esignDocuments.id, id))
    .limit(1)
  return rows[0] ?? null
}

export const listDocuments = async (opts = {}) => {
  let query = db
    .select()
    .from(esignDocuments)
    .orderBy(desc(esignDocuments.createdAt))

  if (opts.status) {
    query = query.where(
      eq(esignDocuments.status, opts.status),
    )
  }

  if (opts.limit) {
    query = query.limit(opts.limit)
  }

  return query
}

export const updateDocument = async (
  id,
  data,
) => {
  await db
    .update(esignDocuments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(esignDocuments.id, id))
}

export const markDocumentCompleted = async (
  id,
  signedPdfBlobKey,
) => {
  await updateDocument(id, {
    status: 'COMPLETED',
    signedPdfBlobKey,
  })
}

// --- Sessions ---

export const createSession = async (data) => {
  const id = nanoid()
  const now = new Date()

  await db.insert(esignSessions).values({
    id,
    documentId: data.documentId,
    signerName: data.signerName,
    signerEmail: data.signerEmail,
    signerRole: data.signerRole ?? 'primary',
    status: 'PENDING',
    signingToken: data.signingToken,
    tokenExpiresAt: data.tokenExpiresAt,
    createdAt: now,
    updatedAt: now,
  })

  return { id, signingToken: data.signingToken }
}

export const getSessionByToken = async (
  token,
) => {
  const rows = await db
    .select()
    .from(esignSessions)
    .where(
      eq(esignSessions.signingToken, token),
    )
    .limit(1)
  return rows[0] ?? null
}

export const getSessionById = async (id) => {
  const rows = await db
    .select()
    .from(esignSessions)
    .where(eq(esignSessions.id, id))
    .limit(1)
  return rows[0] ?? null
}

export const getSessionsByDocumentId = async (
  documentId,
) => {
  return db
    .select()
    .from(esignSessions)
    .where(
      eq(esignSessions.documentId, documentId),
    )
}

export const markSessionViewed = async (
  id,
  context,
) => {
  await db
    .update(esignSessions)
    .set({
      status: 'VIEWED',
      viewedAt: new Date(),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      geoCountry: context.geoCountry,
      geoRegion: context.geoRegion,
      geoCity: context.geoCity,
      updatedAt: new Date(),
    })
    .where(eq(esignSessions.id, id))
}

export const markSessionSigned = async (
  id,
  data,
) => {
  await db
    .update(esignSessions)
    .set({
      status: 'SIGNED',
      signatureData: data.signatureData,
      signatureHash: data.signatureHash,
      signatureCertificate:
        JSON.stringify(data.certificate),
      fieldValues: data.fieldValues ?? null,
      signedAt: new Date(),
      termsAcceptedAt: new Date(),
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      geoCountry: data.geoCountry,
      geoRegion: data.geoRegion,
      geoCity: data.geoCity,
      updatedAt: new Date(),
    })
    .where(eq(esignSessions.id, id))
}

export const revokeSession = async (id) => {
  await db
    .update(esignSessions)
    .set({
      status: 'REVOKED',
      updatedAt: new Date(),
    })
    .where(eq(esignSessions.id, id))
}
