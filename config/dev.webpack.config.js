/* eslint-disable camelcase */
require('dotenv-defaults').config();
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { includeFedMods } = require('./helpers');
const aliases = require('./aliases');
const routes = require('./routes');
const fedMods = require('./fedMods');

const hotReload = process.env.HOT_RELOAD === 'true' ? true : false;

const proxyConfiguration = {
  rootFolder: resolve(__dirname, '../'),
  useProxy: process.env.PROXY === 'true',
  appUrl: process.env.BETA ? ['/beta/insights/compliance', '/preview/insights/compliance'] : ['/insights/compliance'],
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  env: process.env.BETA ? 'stage-beta' : 'stage-stable',
  debug: process.env.PROXY_DEBUG === 'true',
  proxyVerbose: process.env.PROXY_VERBOSE === 'true',
  ...(process.env.LOCAL_CHROME !== 'false' ? {
    localChrome: process.env.LOCAL_CHROME_DIR || process.env.LOCAL_CHROME,
  } : {}),
};

const { config: webpackConfig, plugins } = config(proxyConfiguration);
/**
 * Use for build optimizations
 */
if (process.env.BUNDLE_ANALSE === 'true') {
  const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

  plugins.push(new BundleAnalyzerPlugin());
};

module.exports = {
  ...webpackConfig,
  devServer: {
    ...webpackConfig.devServer,

    // Ensures webpack dev server is accessible (in a container/from another host)
    host: process.env.WEBPACK_BIND || process.env.DEFAULT_HOST,
    allowedHosts: [
      'stage.foo.redhat.com',
      'prod.foo.redhat.com',
      ...(process.env.DEFAULT_HOST ? [process.env.DEFAULT_HOST] : []),
    ],

    // Allow disabling hot/live-reload
    hot: hotReload,
    liveReload: hotReload,
  },
  resolve: {
    ...webpackConfig.resolve,

    // Add Aliases for application specific imports
    alias: {
      ...webpackConfig.resolve.alias,
      ...aliases,
    },
  },
  ...includeFedMods(plugins, fedMods)
};
