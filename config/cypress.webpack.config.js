const webpack = require('webpack');
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
});
plugins.push(
  new webpack.DefinePlugin({
    insights: {
      chrome: {
        auth: {
          getUser: () => {
            return Promise.resolve({});
          },
        },
      },
    },
  })
);

module.exports = {
  ...webpackConfig,
  plugins,
  resolve: {
    alias: {
      PresentationalComponents: resolve(
        __dirname,
        '../src/PresentationalComponents'
      ),
      SmartComponents: resolve(__dirname, '../src/SmartComponents'),
      Mutations: resolve(__dirname, '../src/Mutations'),
      Utilities: resolve(__dirname, '../src/Utilities'),
      Store: resolve(__dirname, '../src/store'),
      '@': resolve(__dirname, '..', 'src'),
    },
    fallback: {
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
    },
  },
};
