import { matchPath } from 'react-router-dom';

import { routes } from '@/Routes';

/**
 * IoP Foreman URL sync reads route metadata from Routes.js — not a hardcoded list.
 * Any route with `modal: true` stays in the iframe hash only; page routes sync to Foreman.
 *  @param pathname
 */
const findExactRoute = (pathname = '') => {
  const normalized = String(pathname).replace(/^\/+/, '') || 'reports';

  return routes.find((route) =>
    matchPath({ path: route.path, end: true }, `/${normalized}`),
  );
};

export function isIframeModalRoute(pathname = '') {
  return Boolean(findExactRoute(pathname)?.modal);
}

/**
 * Maps an in-iframe path to the Foreman browser URL segment we sync.
 * Returns null for modal routes — Foreman URL should not change while a modal is open.
 *  @param pathname
 */
export function getForemanSyncRoute(pathname = '') {
  if (isIframeModalRoute(pathname)) {
    return null;
  }

  const normalized = String(pathname).replace(/^\/+/, '') || 'reports';

  return normalized;
}
