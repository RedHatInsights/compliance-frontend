const { resolve } = require('path');

module.exports = {
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
