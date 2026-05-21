/**
 * Best-effort sync for code paths that still call `window.insights.chrome.getUserPermissions`.
 * Lets stock {@link RBACProvider} / `getRBAC` read IoP Scalprum permissions.
 */
export function ensureChromeRbacBridge() {
  if (typeof window === 'undefined') {
    return { bridged: false, reason: 'no-window' };
  }

  window.insights = window.insights || {};
  const chrome = (window.insights.chrome = window.insights.chrome || {});

  if (typeof chrome.getUserPermissions === 'function') {
    return { bridged: false, reason: 'already-present' };
  }

  const authGetUserPermissions = chrome.auth?.getUserPermissions;
  if (typeof authGetUserPermissions === 'function') {
    chrome.getUserPermissions = authGetUserPermissions;
    return { bridged: true, reason: 'auth-alias' };
  }

  return { bridged: false, reason: 'no-auth-getUserPermissions' };
}
