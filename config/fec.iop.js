const { resolve } = require('path');

const base = require('./fec.base');
const rootDir = resolve(__dirname, '..');

const iopAliases = {
  react: resolve(rootDir, 'node_modules/react'),
  'react-dom': resolve(rootDir, 'node_modules/react-dom'),
  'react/jsx-runtime': resolve(rootDir, 'node_modules/react/jsx-runtime'),
};

module.exports = {
  ...base,
  appUrl: '/',
  definePlugin: {
    'process.env.IOP': JSON.stringify('true'),
  },
  deployment: 'assets/apps',
  moduleFederation: {
    exposes: {},
  },
  resolve: {
    alias: {
      ...base.resolve.alias,
      ...iopAliases,
    },
  },
};
