/* eslint-disable camelcase */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { aliases } = require('./alias.webpack.config');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
});

webpackConfig.devServer = {
  ...webpackConfig.devServer,
};

webpackConfig.performance = {
  hints: 'warning',
};

/**
 * Revise these aliases. Remove those that are not use.
 * Custom dependencies for inventory are included withing the common config
 */
webpackConfig.resolve.alias = {
  ...webpackConfig.resolve.alias,
  ...aliases,
};

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
    }
  )
);

/**
 * Use for build optimizations
 */
// eslint-disable-next-line no-unused-vars
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// plugins.push(new BundleAnalyzerPlugin());

module.exports = {
  ...webpackConfig,
  plugins,
};
