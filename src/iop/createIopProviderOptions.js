/**
 * ScalprumProvider options for IoP iframe — mirrors foreman_rh_cloud ScalprumContext shape.
 *
 *  @param   {object} payload postMessage payload from Foreman
 *  @returns {object}         ScalprumProvider props
 */
export function createIopProviderOptions(payload = {}) {
  const { user = {}, permissions = [] } = payload;

  const getUserPermissions = async (app) => {
    const validPermissions = permissions.filter(
      (entry) => typeof entry?.permission === 'string',
    );

    return app
      ? validPermissions.filter(({ permission }) =>
          permission.startsWith(`${app}:`),
        )
      : validPermissions;
  };

  const chrome = {
    isBeta: () => false,
    on: () => {},
    hideGlobalFilter: () => undefined,
    updateDocumentTitle: (title) => {
      if (title && typeof document !== 'undefined') {
        document.title = title;
      }
    },
    requestPdf: () => undefined,
    getApp: () => 'compliance',
    getBundle: () => '',
    auth: {
      getUser: () => Promise.resolve(user),
      getUserPermissions,
      logout: () => undefined,
    },
    getUserPermissions,
  };

  if (typeof window !== 'undefined') {
    window.insights = window.insights || {};
    // eslint-disable-next-line rulesdir/no-chrome-api-call-from-window
    window.insights.chrome = chrome;
  }

  return {
    api: { chrome },
    config: {},
  };
}
