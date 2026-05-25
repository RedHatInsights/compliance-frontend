/* eslint-disable rulesdir/no-chrome-api-call-from-window -- IoP Scalprum publishes permissions on window.insights.chrome */

/** IoP: FEC getRBAC expects chrome.getUserPermissions; Foreman only sets auth.getUserPermissions. */
export function ensureChromeRbacBridge() {
  const chrome = window?.insights?.chrome;
  if (!chrome?.getUserPermissions && chrome?.auth?.getUserPermissions) {
    chrome.getUserPermissions = chrome.auth.getUserPermissions;
  }
}
