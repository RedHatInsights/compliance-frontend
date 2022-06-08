const { resolve } = require('path');

module.exports = {
  './RootApp': resolve(
    __dirname,
    `../src/${process.env.NODE_ENV === 'development' ? 'Dev' : ''}AppEntry`
  ),
  './SystemDetail': resolve(
    __dirname,
    '../src/SmartComponents/SystemDetails/ComplianceDetail'
  ),
};
