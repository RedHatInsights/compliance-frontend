const { resolve } = require('path');
const alias = require('./config/aliases');
const packageJson = require('./package.json');
const { localRoutesFor } = require('./config/helpers');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

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
  devtool: 'hidden-source-map',
  plugins: [
    // Put the Sentry Webpack plugin after all other plugins
    ...(process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG
      ? [
          sentryWebpackPlugin({
            org: 'red-hat-it',
            project: 'compliance-rhel',
            ...(process.env.SENTRY_AUTH_TOKEN && {
              authToken: process.env.SENTRY_AUTH_TOKEN,
            }),
            moduleMetadata: ({ release }) => ({
              ...(process.env.SENTRY_AUTH_TOKEN && {
                authToken: process.env.SENTRY_AUTH_TOKEN,
              }),
              release,
              dsn: `https://6410c806f0ac7b638105bb4e15eb3399@o490301.ingest.us.sentry.io/4508083145408512`,
              org: 'red-hat-it',
              project: 'compliance-rhel',
            }),
          }),
        ]
      : []),
  ],
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
