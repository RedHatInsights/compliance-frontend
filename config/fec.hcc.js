const { resolve } = require('path');
const packageJson = require('../package.json');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

const base = require('./fec.base');
const rootDir = resolve(__dirname, '..');
const bundle = 'insights';
const appName = packageJson[bundle].appname;

const sentryPlugins = process.env.ENABLE_SENTRY
  ? [
      sentryWebpackPlugin({
        ...(process.env.SENTRY_AUTH_TOKEN && {
          authToken: process.env.SENTRY_AUTH_TOKEN,
        }),
        org: 'red-hat-it',
        project: 'compliance-rhel',
        moduleMetadata: ({ release }) => ({
          dsn: `https://6410c806f0ac7b638105bb4e15eb3399@o490301.ingest.us.sentry.io/4508083145408512`,
          org: 'red-hat-it',
          project: 'compliance-rhel',
          release,
        }),
      }),
    ]
  : [];

module.exports = {
  ...base,
  appUrl: `/${bundle}/${appName}`,
  plugins: sentryPlugins,
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
        rootDir,
        `src/${process.env.NODE_ENV !== 'production' ? 'Dev' : ''}AppEntry`,
      ),
      './SystemDetail': resolve(rootDir, 'src/Modules/ComplianceDetails'),
      './ReportPDFBuild': resolve(
        rootDir,
        'src/SmartComponents/ExportPDF/ReportPDFBuild',
      ),
    },
  },
};
