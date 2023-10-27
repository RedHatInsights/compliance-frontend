/* eslint-disable camelcase */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { includeFedMods } = require('./helpers');
const aliases = require('./aliases');
const fedMods = require('./fedMods');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: process.env.PROXY_DEBUG === 'true',
  ...(process.env.BETA === 'true' && { deployment: 'beta/apps' }),
});

webpackConfig.performance = {
  hints: 'warning',
};

webpackConfig.resolve.alias = {
  ...webpackConfig.resolve.alias,
  ...aliases,
};

/**
 * Use for build optimizations
 */
if (process.env.BUNDLE_ANALSE === 'true') {
  const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  ...webpackConfig,
  ...includeFedMods(plugins, fedMods),
};
