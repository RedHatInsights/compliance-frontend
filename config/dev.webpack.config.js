/* eslint-disable camelcase */
require('dotenv').config({ path: '.env.defaults' });

const defaults = {
  LOCAL_CHROME: 'false',
  CHROME_ENV: 'stage-stable',
  BETA: 'false',
  FILE_HASH: 'false',
  LOCAL_NODE_MODULES: 'false',
  WEBPACK_DEBUG: 'false',
  FRONTEND_PORT: '8002',
  PROXY: 'false',
  CHROME_DIR: '../insights-chrome/build',
  STANDALONE: 'false',
};

const withDefault = (envVar) => {
  const defaultValue = process?.env[envVar] || defaults[envVar];
  if (defaultValue === 'true' || defaultValue === 'false') {
    return defaultValue === 'true';
  } else {
    return process?.env[envVar] || defaults[envVar];
  }
};

const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { devserverConfig } = require('./devserver.config');
const { aliases } = require('./alias.webpack.config');

const useLocalChrome = () =>
  withDefault('LOCAL_CHROME')
    ? {
        localChrome: withDefault('CHROME_DIR'),
      }
    : {};

const chromeEnv = () => {
  const env = withDefault('CHROME_ENV');
  return env ? env : `ci-${withDefault('BETA') === 'true' ? 'beta' : 'stable'}`;
};

const useStandalone = () =>
  withDefault('STANDALONE') === 'true'
    ? {
        reposDir: '/tmp',
        standalone: true,
      }
    : {};

const insightsProxy = {
  https: false,
  port: withDefault('FRONTEND_PORT'),
  ...(withDefault('BETA') === 'true' && { deployment: 'beta/apps' }),
};

const webpackProxy = {
  deployment: withDefault('BETA') === 'true' ? 'beta/apps' : 'apps',
  appUrl:
    withDefault('BETA') === 'true'
      ? ['/beta/insights/compliance']
      : ['/insights/compliance'],
  env: chromeEnv(),
  useProxy: true,
  proxyVerbose: true,
  ...useLocalChrome(),
  ...useStandalone(),
  routesPath:
    withDefault('ROUTES_PATH') ||
    resolve(__dirname, '../config/spandx.config.js'),
  routes: {
    // Additional routes to the spandx config
    // '/beta/config': { host: 'http://localhost:8003' }, // for local CSC config
  },
};

const { config: webpackConfig, plugins } = (() => {
  const initConfig = {
    rootFolder: resolve(__dirname, '../'),
    debug: withDefault('WEBPACK_DEBUG') === 'true',
    useFileHash: false,
    ...(withDefault('PROXY') ? webpackProxy : insightsProxy),
  };

  console.log('Configuration provided', initConfig);
  return config(initConfig);
})();

/**
 * Revise these aliases. Remove those that are not use.
 * Custom dependencies for inventory are included withing the common config
 */
webpackConfig.resolve.alias = {
  ...webpackConfig.resolve.alias,
  ...aliases,
};

webpackConfig.resolve = {
  ...webpackConfig.resolve,
  ...(process.env.LOCAL_NODE_MODULES === 'true' && {
    modules: [resolve('./node_modules')],
  }),
};

webpackConfig.devServer = {
    ...webpackConfig.devServer,
    ...devserverConfig,
    static: {
        ...webpackConfig.devServer.static,
        ...devserverConfig.static
    }
}

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      useFileHash: false,
      exposes: {
        './RootApp': resolve(__dirname, '../src/DevAppEntry'),
        './SystemDetail': resolve(
          __dirname,
          '../src/SmartComponents/SystemDetails/ComplianceDetail'
        ),
      },
    }
  )
);

module.exports = {
  ...webpackConfig,
  plugins,
};
