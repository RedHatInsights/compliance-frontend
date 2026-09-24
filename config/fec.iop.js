const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const base = require('./fec.base');
const rootDir = resolve(__dirname, '..');

const iopAliases = {
  '@redhat-cloud-services/frontend-components/InsightsLink': resolve(
    rootDir,
    './src/iop/ComplianceLink.js',
  ),
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate':
    resolve(rootDir, './src/iop/useComplianceNavigate.js'),
  react: resolve(rootDir, 'node_modules/react'),
  'react-dom': resolve(rootDir, 'node_modules/react-dom'),
  'react/jsx-runtime': resolve(rootDir, 'node_modules/react/jsx-runtime'),
};

module.exports = {
  ...base,
  appUrl: '/',
  definePlugin: { 'process.env.IOP': JSON.stringify('true') },
  deployment: 'assets/apps',
  standalone: true,
  appEntry: resolve(rootDir, './src/iop/entry.js'),
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(rootDir, './src/iop/index.html'),
      inject: true,
      chunks: ['App'],
    }),
  ],
  moduleFederation: {
    bundleChromeShared: true,
  },
  resolve: {
    alias: {
      ...base.resolve.alias,
      ...iopAliases,
    },
  },
};
