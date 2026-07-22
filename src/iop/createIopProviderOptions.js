/**
 * ScalprumProvider options for IoP iframe — mirrors foreman_rh_cloud ScalprumContext shape.
 *
 *  @param   {object} payload postMessage payload from Foreman
 *  @returns {object}         ScalprumProvider props
 */

const inventoryModuleConfig = {
  name: 'inventory',
  manifestLocation: `${window.location.origin}/assets/apps/inventory/fed-mods.json`,
  cdnPath: `${window.location.origin}/assets/apps/inventory/`,
};

const modulesConfig = {
  inventory: inventoryModuleConfig,
};

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
    pluginSDKOptions: {
      pluginLoaderOptions: {
        transformPluginManifest: (manifest) => {
          const module = modulesConfig[manifest.name];
          if (manifest.baseURL === 'auto' && module?.cdnPath) {
            return {
              ...manifest,
              baseURL: module.cdnPath,
              loadScripts: (manifest.loadScripts || []).map(
                (script) => `${module.cdnPath}${script}`,
              ),
            };
          }
          return manifest;
        },
      },
    },
    api: { chrome },
    config: modulesConfig,
  };
}
