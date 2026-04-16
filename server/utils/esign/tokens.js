// Signing token generation and expiration
// utilities. Uses Web Crypto API for
// Cloudflare Workers compatibility.

const toHex = bytes =>
  Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

export const generateSigningToken = () => {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return toHex(bytes)
}

export const calculateTokenExpiration = (
  expiresIn = '48h',
) => {
  const now = Date.now()

  if (typeof expiresIn === 'number') {
    return new Date(now + expiresIn)
  }

  const match = expiresIn.match(/^(\d+)(m|h|d)$/)
  const value = match
    ? parseInt(match[1], 10)
    : 48
  const unit = match?.[2] ?? 'h'

  const ms = {
    m: value * 60 * 1000,
    h: value * 60 * 60 * 1000,
    d: value * 24 * 60 * 60 * 1000,
  }

  return new Date(now + (ms[unit] ?? ms.h))
}

export const isTokenExpired = (expiresAt) => {
  const expiry = expiresAt instanceof Date
    ? expiresAt.getTime()
    : expiresAt
  return Date.now() > expiry
}

export const DEFAULT_TOKEN_EXPIRY = '48h'
