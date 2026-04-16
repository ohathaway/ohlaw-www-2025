// Tamper-evident signature certificate
// generation and verification. Adapted from
// YTP's signature-certificate.ts for OH Law.
//
// IMPORTANT: These certificates create a legal
// audit trail. Do not modify the structure
// without understanding ESIGN/UETA implications.

const nanoid = () =>
  crypto.randomUUID().replace(/-/g, '')

export const sha256 = async (data) => {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(data)
  const hash = await crypto.subtle.digest(
    'SHA-256',
    buffer,
  )
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export const generateSignatureCertificate
  = async (input) => {
    const now = new Date()
    const certificateId = nanoid()

    const documentHash = await sha256(
      input.documentContent,
    )
    const signatureDataHash = await sha256(
      input.signatureData,
    )

    const geo
      = input.signer.country
        || input.signer.region
        || input.signer.city
        ? {
            country: input.signer.country,
            region: input.signer.region,
            city: input.signer.city,
          }
        : null

    const certificateData = {
      version: '1.0',
      certificateId,
      documentId: input.documentId,
      documentHash,
      signatureSessionId:
        input.signatureSessionId,
      signer: {
        sessionId: input.signer.sessionId,
        email: input.signer.email,
        name: input.signer.name,
        ipAddress: input.signer.ipAddress,
        userAgent: input.signer.userAgent,
        geolocation: geo,
      },
      signature: {
        capturedAt: now.toISOString(),
        dataHash: signatureDataHash,
      },
      terms: {
        acceptedAt:
          input.timestamps.termsAccepted
            .toISOString(),
        version: input.termsVersion,
      },
      timestamps: {
        sessionCreated:
          input.timestamps.sessionCreated
            .toISOString(),
        documentViewed:
          input.timestamps.documentViewed
            ?.toISOString() ?? null,
        signed: now.toISOString(),
        certificateGenerated: now.toISOString(),
      },
    }

    const certificateHash = await sha256(
      JSON.stringify(certificateData),
    )

    return { ...certificateData, certificateHash }
  }

export const verifyCertificateIntegrity
  = async (certificate) => {
    const { certificateHash, ...data } = certificate
    const computed = await sha256(
      JSON.stringify(data),
    )
    return computed === certificateHash
  }

export const CURRENT_TERMS_VERSION = '2025.1'
