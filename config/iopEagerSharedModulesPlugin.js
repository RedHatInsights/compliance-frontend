const { DynamicRemotePlugin } = require('@openshift/dynamic-plugin-sdk-webpack/dist/index.cjs.js');

let patchInstalled = false;

const resolveImportPath = (root, moduleName) => {
  try {
    return require.resolve(moduleName, { paths: [root] });
  } catch {
    return null;
  }
};

const patchSharedModules = (root, sharedModules = {}) =>
  Object.fromEntries(
    Object.entries(sharedModules).map(([moduleName, config]) => {
      if (config.import !== false && config.eager === true) {
        return [moduleName, config];
      }

      const importPath = resolveImportPath(root, moduleName);

      if (!importPath) {
        return [moduleName, config];
      }

      return [
        moduleName,
        {
          ...config,
          eager: true,
          import: importPath,
        },
      ];
    }),
  );

/**
 * FEC registers chrome-provided module federation shared modules with import:false, 
 * expecting insights-chrome as host. IoP iframe has no host — patch shared modules 
 * to eager local imports before DynamicRemotePlugin initializes module federation.
 */
const installIopSharedModulesPatch = (root = process.cwd()) => {
  if (patchInstalled) {
    return;
  }

  patchInstalled = true;

  const originalApply = DynamicRemotePlugin.prototype.apply;

  DynamicRemotePlugin.prototype.apply = function applyWithEagerShared(compiler) {
    if (this.adaptedOptions?.sharedModules) {
      this.adaptedOptions.sharedModules = patchSharedModules(
        root,
        this.adaptedOptions.sharedModules,
      );
    }

    return originalApply.call(this, compiler);
  };
};

module.exports = installIopSharedModulesPatch;
module.exports.patchSharedModules = patchSharedModules;
