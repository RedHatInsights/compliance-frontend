const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// PF5 and PF6 ship different font files under the same names. FEC emits
// fonts/[name][ext], so the second pack overwrites the first.
class IopDistinctFontFilenamesPlugin {
  apply(compiler) {
    compiler.options.module.rules.forEach((rule) => {
      if (
        rule.type === 'asset/resource' &&
        rule.generator?.filename === 'fonts/[name][ext]'
      ) {
        rule.generator.filename = 'fonts/[name].[contenthash][ext]';
      }
    });
  }
}

const base = require('./fec.base');
const rootDir = resolve(__dirname, '..');

const iopAliases = {
  '@redhat-cloud-services/frontend-components/InsightsLink': resolve(
    rootDir,
    './src/iop/ComplianceLink.js',
  ),
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate':
    resolve(rootDir, './src/iop/useComplianceNavigate.js'),
  '@redhat-cloud-services/frontend-components/Inventory$': resolve(
    rootDir,
    './src/iop/Inventory.js',
  ),
  react: resolve(rootDir, 'node_modules/react'),
  'react-dom': resolve(rootDir, 'node_modules/react-dom'),
  'react/jsx-runtime': resolve(rootDir, 'node_modules/react/jsx-runtime'),
};

module.exports = {
  ...base,
  appUrl: '/',
  definePlugin: {
    'process.env.IOP': JSON.stringify('true'),
    'process.env.IOP_API_MOCKED': JSON.stringify(
      process.env.IOP_API_MOCKED === 'true' ? 'true' : 'false',
    ),
  },
  deployment: 'assets/apps',
  standalone: true,
  appEntry: resolve(rootDir, './src/iop/entry.js'),
  plugins: [
    new IopDistinctFontFilenamesPlugin(),
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
