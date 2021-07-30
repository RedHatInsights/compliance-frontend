/* eslint-disable camelcase */
/* global module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { devserverConfig } = require('./devserver.config');
const { aliases } = require('./alias.webpack.config');
const { routes } = require('./spandx.config.js');

const insightsProxy = {
    https: false,
    port: process.env.FRONTEND_PORT ? process.env.FRONTEND_PORT  : '8002',
    ...(process.env.BETA && { deployment: 'beta/apps' }),
  };

  const webpackProxy = {
    deployment: process.env.BETA ? 'beta/apps' : 'apps',
    appUrl: process.env.BETA ? ['/beta/insights/compliance'] : ['/insights/compliance'],
    env: `ci-${process.env.BETA ? 'beta' : 'stable'}`, // pick chrome env ['ci-beta', 'ci-stable', 'qa-beta', 'qa-stable', 'prod-beta', 'prod-stable']
    useProxy: true,
    proxyVerbose: true,
    useCloud: true, // until console pre-prod env is ready
    // localChrome: '~/insights/insights-chrome/build/', // for local chrome builds
    routes: {
        //   '/beta/config': { host: 'http://localhost:8003' }, // for local CSC config
        ...routes
    },
  };


const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    useFileHash: false,
    ...(process.env.PROXY ? webpackProxy : insightsProxy),
});

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
    modules: [resolve('./node_modules')],
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
        },
    })
);

module.exports = {
    ...webpackConfig,
    plugins
};
