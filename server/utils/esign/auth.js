// Firebase ID token verification without
// firebase-admin SDK. Verifies JWTs directly
// using Google's public keys. Works in
// Cloudflare Workers.

let cachedKeys = null
let cachedKeysExpiry = 0

const GOOGLE_CERTS_URL
  = 'https://www.googleapis.com/robot/v1'
    + '/metadata/x509/securetoken'
    + '@system.gserviceaccount.com'

// Fetch Google's public keys (cached)
const getPublicKeys = async () => {
  if (cachedKeys && Date.now() < cachedKeysExpiry) {
    return cachedKeys
  }

  const response = await fetch(GOOGLE_CERTS_URL)
  const keys = await response.json()

  // Cache based on Cache-Control header
  const cacheControl
    = response.headers.get('cache-control') ?? ''
  const maxAge = cacheControl.match(
    /max-age=(\d+)/,
  )
  cachedKeysExpiry = Date.now()
    + (maxAge
      ? parseInt(maxAge[1], 10) * 1000
      : 3600000)
  cachedKeys = keys

  return keys
}

// Import a PEM certificate as a CryptoKey
const importPublicKey = async (pem) => {
  const pemBody = pem
    .replace(/-----BEGIN CERTIFICATE-----/, '')
    .replace(/-----END CERTIFICATE-----/, '')
    .replace(/\s/g, '')

  const binaryDer = Uint8Array.from(
    atob(pemBody),
    c => c.charCodeAt(0),
  )

  return crypto.subtle.importKey(
    'spki',
    extractSPKI(binaryDer),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  )
}

// Extract SPKI from X.509 certificate DER
// (simplified — finds the SubjectPublicKeyInfo)
const extractSPKI = (certDer) => {
  // X.509 certs contain SPKI starting after
  // a known ASN.1 sequence. Use a simple
  // approach: re-export via the full cert.
  // For Workers, we parse the ASN.1 manually.
  //
  // Simpler: use the Web Crypto importKey with
  // the raw cert — but Workers don't support
  // X.509 directly. So we'll use jose library
  // if available, or fall back to a fetch-based
  // approach.
  //
  // Actually, the cleanest Workers-compatible
  // approach: decode the JWT header to get kid,
  // fetch the JWKS endpoint instead of x509.
  return certDer
}

// Google also publishes JWKS format keys
const GOOGLE_JWKS_URL
  = 'https://www.googleapis.com/service_accounts'
    + '/v1/jwk/securetoken'
    + '@system.gserviceaccount.com'

let cachedJwks = null
let cachedJwksExpiry = 0

const getJwks = async () => {
  if (cachedJwks && Date.now() < cachedJwksExpiry) {
    return cachedJwks
  }

  const response = await fetch(GOOGLE_JWKS_URL)
  const data = await response.json()

  cachedJwksExpiry = Date.now() + 3600000
  cachedJwks = data.keys

  return cachedJwks
}

// Import JWK as CryptoKey
const importJwk = async jwk =>
  crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  )

// Base64url decode
const b64urlDecode = (str) => {
  const padded = str
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const pad = padded.length % 4
  const final = pad
    ? padded + '='.repeat(4 - pad)
    : padded
  return Uint8Array.from(
    atob(final),
    c => c.charCodeAt(0),
  )
}

// Verify Firebase ID token
export const verifyIdToken = async (token) => {
  const config = useRuntimeConfig()
  const projectId = config.public.firebase.projectId

  // Decode header and payload without verifying
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }

  const header = JSON.parse(
    new TextDecoder().decode(b64urlDecode(parts[0])),
  )
  const payload = JSON.parse(
    new TextDecoder().decode(b64urlDecode(parts[1])),
  )

  // Verify claims
  const now = Math.floor(Date.now() / 1000)

  if (payload.iss
    !== `https://securetoken.google.com/${projectId}`) {
    throw new Error('Invalid issuer')
  }
  if (payload.aud !== projectId) {
    throw new Error('Invalid audience')
  }
  if (payload.exp < now) {
    throw new Error('Token expired')
  }
  if (payload.iat > now + 60) {
    throw new Error('Token issued in the future')
  }
  if (!payload.sub) {
    throw new Error('Missing subject')
  }

  // Verify signature using JWKS
  const jwks = await getJwks()
  const key = jwks.find(k => k.kid === header.kid)

  if (!key) {
    throw new Error('Key not found for kid: '
      + header.kid)
  }

  const cryptoKey = await importJwk(key)
  const signatureBytes = b64urlDecode(parts[2])
  const dataBytes = new TextEncoder().encode(
    `${parts[0]}.${parts[1]}`,
  )

  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signatureBytes,
    dataBytes,
  )

  if (!valid) {
    throw new Error('Invalid signature')
  }

  return {
    uid: payload.sub,
    email: payload.email,
    name: payload.name,
    email_verified: payload.email_verified,
  }
}

const ALLOWED_DOMAIN = 'ohlawcolorado.com'

export const isAllowedEmail = email =>
  email?.endsWith(`@${ALLOWED_DOMAIN}`)
