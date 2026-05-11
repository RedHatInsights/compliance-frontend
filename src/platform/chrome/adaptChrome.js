/**
 * Wraps hybrid-console `chrome` in a small, safe API for Compliance.
 *
 *  @param   {Record<string, unknown>}                           rawChrome Return value of `useChrome()`.
 *  @param   {{ chrome: { useDocumentTitleFallback: boolean } }} appConfig Active app config (e.g. from `getAppConfig()`).
 *  @returns {object}                                                      Narrow surface: `hideGlobalFilter`, `updateDocumentTitle`, `requestPdf`, and `auth`.
 */
export function adaptChrome(rawChrome, appConfig) {
  const hideGlobalFilter = (hide) => {
    const fn = rawChrome?.hideGlobalFilter;
    if (typeof fn === 'function') {
      fn.call(rawChrome, hide);
    }
  };

  const updateDocumentTitle = (title) => {
    const fn = rawChrome?.updateDocumentTitle;
    if (typeof fn === 'function') {
      fn.call(rawChrome, title);
      return;
    }
    if (
      appConfig.chrome.useDocumentTitleFallback &&
      typeof document !== 'undefined' &&
      title
    ) {
      document.title = title;
    }
  };

  const requestPdf = (options) => {
    const fn = rawChrome?.requestPdf;
    if (typeof fn === 'function') {
      return fn.call(rawChrome, options);
    }
    return undefined;
  };

  return {
    hideGlobalFilter,
    updateDocumentTitle,
    requestPdf,
    auth: rawChrome?.auth,
  };
}
