// Public endpoint: fetch signing session by
// token. Updates status to VIEWED on first
// access. No auth required.

import {
  getSessionByToken,
  getDocumentById,
  markSessionViewed,
} from '../../../utils/esign/db'
import { isTokenExpired }
  from '../../../utils/esign/tokens'

export default defineEventHandler(
  async (event) => {
    const token = getRouterParam(event, 'token')

    const session = await getSessionByToken(token)

    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Signing link not found',
      })
    }

    if (session.status === 'REVOKED') {
      throw createError({
        statusCode: 410,
        statusMessage:
          'This signing link has been revoked',
      })
    }

    if (session.status === 'SIGNED') {
      throw createError({
        statusCode: 410,
        statusMessage:
          'This document has already been signed',
      })
    }

    if (isTokenExpired(session.tokenExpiresAt)) {
      throw createError({
        statusCode: 410,
        statusMessage:
          'This signing link has expired',
      })
    }

    const document = await getDocumentById(
      session.documentId,
    )

    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found',
      })
    }

    // Mark as viewed on first access
    if (session.status === 'PENDING') {
      const context = {
        ipAddress: getRequestHeader(
          event,
          'cf-connecting-ip',
        ) ?? getRequestHeader(
          event,
          'x-forwarded-for',
        ),
        userAgent: getRequestHeader(
          event,
          'user-agent',
        ),
        geoCountry: getRequestHeader(
          event,
          'cf-ipcountry',
        ),
        geoRegion: getRequestHeader(
          event,
          'cf-region',
        ),
        geoCity: getRequestHeader(
          event,
          'cf-ipcity',
        ),
      }

      await markSessionViewed(
        session.id,
        context,
      )
    }

    // Parse field placements and filter
    // to this signer's role
    const allPlacements
      = document.fieldPlacements
        ? JSON.parse(document.fieldPlacements)
        : []
    const myPlacements = allPlacements.filter(
      f => String(f.signerRole)
        === String(session.signerRole),
    )

    return {
      document: {
        id: document.id,
        title: document.title,
        contentHtml: document.contentHtml,
      },
      session: {
        id: session.id,
        signerName: session.signerName,
        signerEmail: session.signerEmail,
        signerRole: session.signerRole,
        status: session.status === 'PENDING'
          ? 'VIEWED'
          : session.status,
        tokenExpiresAt: session.tokenExpiresAt,
      },
      fieldPlacements: myPlacements,
    }
  },
)
