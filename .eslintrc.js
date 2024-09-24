module.exports = {
  parser: '@babel/eslint-parser',
  plugins: ['jsdoc'],
  extends: [
    '@redhat-cloud-services/eslint-config-redhat-cloud-services',
    'plugin:cypress/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'plugin:jsdoc/recommended',
    'plugin:react-hooks/recommended',
  ],
  globals: {
    React: true,
  },
  rules: {
    'rulesdir/forbid-pf-relative-imports': 'off',
    'jsdoc/tag-lines': 0,
    'jsdoc/require-jsdoc': 0,
    'jsdoc/check-line-alignment': [
      'error',
      'always',
      { customSpacings: { postDelimiter: 2 } },
    ],
    'jsdoc/check-tag-names': [
      'warn',
      { definedTags: ['category', 'subcategory'] },
    ],
  },
};
