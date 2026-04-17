// Public endpoint: submit signature for a
// signing session. Generates certificate,
// checks for multi-signer completion, and
// triggers PDF generation when all signed.

import {
  getSessionByToken,
  getDocumentById,
  getSessionsByDocumentId,
  markSessionSigned,
  markDocumentCompleted,
} from '../../../utils/esign/db'
import { isTokenExpired }
  from '../../../utils/esign/tokens'
import {
  sha256,
  generateSignatureCertificate,
  CURRENT_TERMS_VERSION,
} from '../../../utils/esign/certificate'
import { blob } from 'hub:blob'
import { stampFieldsAndSign }
  from '../../../utils/esign/document-pdf'
import {
  sendSigningConfirmation,
  sendCompletionNotice,
} from '../../../utils/esign/notifications'

export default defineEventHandler(
  async (event) => {
    const token = getRouterParam(event, 'token')
    const body = await readBody(event)

    if (!body.termsAccepted) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Terms acceptance is required',
      })
    }

    // Signature can come from top-level
    // (legacy) or from fieldValues
    const fieldValues = body.fieldValues ?? {}
    const signatureData
      = body.signatureData
        || Object.values(fieldValues).find(
          v => v?.startsWith?.('data:image'),
        )

    if (!signatureData) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Signature is required',
      })
    }

    const session = await getSessionByToken(token)

    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Signing link not found',
      })
    }

    if (
      session.status === 'SIGNED'
      || session.status === 'REVOKED'
    ) {
      throw createError({
        statusCode: 410,
        statusMessage:
          'This session is no longer active',
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

    // Capture request context
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

    // Hash signature data
    const signatureHash = await sha256(
      body.signatureData,
    )

    // Generate tamper-evident certificate
    const certificate
      = await generateSignatureCertificate({
        documentId: document.id,
        documentContent: document.contentHtml,
        signatureSessionId: session.id,
        signer: {
          sessionId: session.id,
          email: session.signerEmail,
          name: session.signerName,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          country: context.geoCountry,
          region: context.geoRegion,
          city: context.geoCity,
        },
        signatureData: signatureData,
        termsVersion: CURRENT_TERMS_VERSION,
        timestamps: {
          sessionCreated: session.createdAt,
          documentViewed:
            session.viewedAt ?? null,
          termsAccepted: new Date(),
        },
      })

    // Update session as signed
    await markSessionSigned(session.id, {
      signatureData,
      signatureHash,
      certificate,
      fieldValues: JSON.stringify(fieldValues),
      ...context,
    })

    // Check if all sessions are signed
    const allSessions
      = await getSessionsByDocumentId(document.id)
    const allSigned = allSessions.every(
      s => s.id === session.id
        || s.status === 'SIGNED',
    )

    let signedPdfBytes = null

    if (allSigned && document.status !== 'COMPLETED') {
      // Refresh sessions with signature data
      const completedSessions
        = await getSessionsByDocumentId(document.id)

      try {
        // Load unsigned PDF, append signatures
        const unsignedKey
          = `esign/unsigned/${document.id}.pdf`
        const unsignedBlob
          = await blob.get(unsignedKey)
        const unsignedBytes = new Uint8Array(
          await unsignedBlob.arrayBuffer(),
        )

        // Parse field placements from document
        const placements
          = document.fieldPlacements
            ? JSON.parse(
                document.fieldPlacements,
              )
            : []

        const signedBytes
          = await stampFieldsAndSign(
            unsignedBytes,
            placements,
            completedSessions,
          )
        signedPdfBytes = signedBytes

        const blobKey
          = `esign/signed/${document.id}.pdf`
        await blob.put(
          blobKey,
          new Uint8Array(signedBytes),
          { contentType: 'application/pdf' },
        )

        await markDocumentCompleted(
          document.id,
          blobKey,
        )

        sendCompletionNotice(
          document,
          completedSessions,
          null,
        ).catch(err =>
          console.error(
            'Failed to send completion:',
            err,
          ),
        )
      }
      catch (err) {
        console.error(
          'Failed to generate signed PDF:',
          err,
        )
        // Still mark completed even if PDF fails
        await markDocumentCompleted(
          document.id,
          null,
        )
      }
    }

    // Send confirmation to signer with signed
    // PDF attached (if available)
    sendSigningConfirmation(
      session,
      document,
      signedPdfBytes,
    ).catch(err =>
      console.error(
        'Failed to send confirmation:',
        err,
      ),
    )

    return {
      success: true,
      certificateId: certificate.certificateId,
    }
  },
)
