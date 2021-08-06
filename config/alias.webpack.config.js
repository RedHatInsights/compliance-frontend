const { resolve } = require('path');

const aliases = {
  react: resolve(__dirname, '../node_modules/react'),
  'react-intl': resolve(__dirname, '../node_modules/react-intl'),
  PresentationalComponents: resolve(
    __dirname,
    '../src/PresentationalComponents'
  ),
  SmartComponents: resolve(__dirname, '../src/SmartComponents'),
  Mutations: resolve(__dirname, '../src/Mutations'),
  Utilities: resolve(__dirname, '../src/Utilities'),
  Store: resolve(__dirname, '../src/store'),
  '@': resolve(__dirname, '..', 'src'),
};

module.exports.aliases = aliases;
