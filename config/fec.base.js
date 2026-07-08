const alias = require('./aliases');
const packageJson = require('../package.json');
const { localRoutesFor } = require('./helpers');

const bundle = 'insights';
const appName = packageJson[bundle].appname;

// TODO Move to fec webpack config similar to LOCAL_APIS
const routes = {
  ...(process.env.LOCAL_APIS && process.env.LOCAL_APIS !== ''
    ? localRoutesFor('/api', process.env.LOCAL_APIS)
    : {}),
};

module.exports = {
  appName,
  useProxy: process.env.PROXY === 'true',
  devtool: 'hidden-source-map',
  routes,
  _unstableSpdy: true,
  frontendCRDPath: 'deployment_template.yaml',
  resolve: {
    alias: {
      ...alias,
    },
  },
};
