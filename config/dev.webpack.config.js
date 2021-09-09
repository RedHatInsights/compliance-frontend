/* eslint-disable camelcase */
/* global module, __dirname */
require('dotenv').config();

const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { devserverConfig } = require('./devserver.config');
const { aliases } = require('./alias.webpack.config');

const useLocalChrome = () => (
    process.env.LOCAL_CHROME === 'true' ? {
        localChrome: process.env.CHROME_DIR
    } : {}
);

const useStandalone  = () => (
  process.env.STANDALONE === 'true' ? {
  reposDir: '/tmp',
  standalone: true } : {}
)

const chromeEnv = () => {
    const env = process.env?.CHROME_ENV;
    return env ? env : `ci-${process.env.BETA ? 'beta' : 'stable'}`
}

const insightsProxy = {
    https: false,
    port: process.env.FRONTEND_PORT ? process.env.FRONTEND_PORT  : '8002',
    ...(process.env.BETA && { deployment: 'beta/apps' }),
};

const webpackProxy = {
    deployment: process.env.BETA ? 'beta/apps' : 'apps',
    appUrl: process.env.BETA ? ['/beta/insights/compliance'] : ['/insights/compliance'],
    env: chromeEnv(),
    useProxy: true,
    proxyVerbose: true,
    useCloud: (process.env?.USE_CLOUD === 'true'),
    ...useLocalChrome(),
    routesPath: process.env.ROUTES_PATH || resolve(__dirname, '../config/spandx.config.js'),
    ...useStandalone(),
    routes: {
        // Additional routes to the spandx config
        // '/beta/config': { host: 'http://localhost:8003' }, // for local CSC config
    },
};

const { config: webpackConfig, plugins } = (() => {
    const initConfig = {
        rootFolder: resolve(__dirname, '../'),
        debug: (process.env?.WEBPACK_DEBUG === 'true'),
        useFileHash: false,
        ...(process.env.PROXY ? webpackProxy : insightsProxy),
    };

    console.log('Configuration provided', initConfig)
    return config(initConfig)
})();

/**
 * Revise these aliases. Remove those that are not use.
 * Custom dependencies for inventory are included withing the common config
 */
webpackConfig.resolve.alias = {
    ...webpackConfig.resolve.alias,
    ...aliases
};

webpackConfig.resolve = {
    ...webpackConfig.resolve,
    ...process.env.LOCAL_NODE_MODULES === 'true' && { modules: [resolve('./node_modules')] },
}

webpackConfig.devServer = {
    ...webpackConfig.devServer,
    ...devserverConfig
}

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')({
        root: resolve(__dirname, '../'),
        useFileHash: false,
        exposes: {
            './RootApp': resolve(__dirname, '../src/bootstrap-dev'),
            './SystemDetail': resolve(
              __dirname,
              '../src/SmartComponents/SystemDetails/ComplianceDetail'
            ),
        },
    })
);

module.exports = {
    ...webpackConfig,
    plugins
};
