/* eslint-disable camelcase */
/* global module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { devserverConfig } = require('./devserver.config');
const { aliases } = require('./alias.webpack.config');

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true
});

/**
 * Revise these aliases. Remove those that are not use.
 * Custom dependencies for inventory are included withing the common config
 */
webpackConfig.resolve.alias = {
    ...webpackConfig.resolve.alias,
    ...aliases
};

webpackConfig.devServer = {
    ...webpackConfig.devServer,
    ...devserverConfig
}

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')({
        root: resolve(__dirname, '../')
    })
);

module.exports = {
    ...webpackConfig,
    plugins
};
