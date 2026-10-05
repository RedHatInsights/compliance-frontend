const base = require('./fec.base');

module.exports = {
  ...base,
  appUrl: '/',
  definePlugin: {
    'process.env.IOP': JSON.stringify('true'),
  },
  deployment: 'assets/apps',
  standalone: true,
};
