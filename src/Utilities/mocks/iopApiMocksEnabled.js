/**
 * Fixture data instead of the Compliance API.
 * Set IOP_API_MOCKED=true for the IoP dev server. Production IoP builds leave it unset.
 */
export function isIopApiMocksEnabled() {
  return process.env.IOP_API_MOCKED === 'true';
}
