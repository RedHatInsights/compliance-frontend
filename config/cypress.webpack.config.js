const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const alias = require('./aliases');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
});

module.exports = {
  ...webpackConfig,
  plugins,
  module: {
    ...webpackConfig.module,
    rules: [
      ...webpackConfig.module.rules,
      {
        resolve: {
          alias: {
            // TODO we should look into using only one useChrome mock for both jest and cyrpess tests
            '@redhat-cloud-services/frontend-components/useChrome': resolve(
              __dirname,
              './overrideChrome.js'
            ),
            '../useChrome': resolve(__dirname, './overrideChrome.js'),
          },
        },
      },
    ],
  },
  resolve: {
    alias,
    fallback: {
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
    },
  },
};
