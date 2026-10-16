export function isIopApiMocksEnabled() {
  return process.env.IOP_API_MOCKED === 'true';
}
