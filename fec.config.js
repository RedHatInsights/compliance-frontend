const { resolve } = require('path');
const alias = require('./config/aliases');
const packageJson = require('./package.json');
const { localRoutesFor } = require('./config/helpers');

const bundle = 'insights';
const appName = packageJson[bundle].appname;

// TODO Move to fec webpack config similar to LOCAL_APPS
const routes = {
  ...(process.env.LOCAL_APIS && process.env.LOCAL_APIS !== ''
    ? localRoutesFor('/api', process.env.LOCAL_APIS)
    : {}),
};

module.exports = {
  appName,
  appUrl: `/${bundle}/${appName}`,
  useProxy: process.env.PROXY === 'true',
  moduleFederation: {
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: packageJson.dependencies['react-router-dom'],
          requiredVersion: '>=6.0.0 <7.0.0',
        },
      },
    ],
    exposes: {
      './RootApp': resolve(
        __dirname,
        `/src/${process.env.NODE_ENV !== 'production' ? 'Dev' : ''}AppEntry`
      ),
      './SystemDetail': resolve(__dirname, '/src/Modules/ComplianceDetails'),
    },
  },
  resolve: {
    alias,
  },
  routes,
  _unstableSpdy: true,
};
