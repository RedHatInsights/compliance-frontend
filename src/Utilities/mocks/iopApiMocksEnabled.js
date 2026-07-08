import { getAppConfig } from '@/config/appConfig';

const IOP = 'iop';

/**
 * IoP builds run without a live Compliance API. When true, query hooks return
 * fixture data instead of calling the network.
 */
export function isIopApiMocksEnabled() {
  return getAppConfig().envTarget === IOP;
}
