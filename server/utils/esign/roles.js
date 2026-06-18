// Canonical signer-role handling. Roles are
// stored in a text column, but multi-signer
// roles arrive from the UI as numbers (1-6),
// which the D1 driver can persist as "1.0".
// That breaks string comparisons against field
// placements (which use "1"). Normalize so
// numeric roles always resolve to a plain
// integer string, while legacy labels
// ('primary' / 'joint') pass through unchanged.

export const normalizeSignerRole = (role) => {
  if (role === null || role === undefined) {
    return 'primary'
  }

  const str = String(role).trim()
  const num = Number(str)

  return str !== '' && Number.isFinite(num)
    ? String(Math.trunc(num))
    : str
}
