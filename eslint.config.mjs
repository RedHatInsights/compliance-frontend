import fecPlugin from '@redhat-cloud-services/eslint-config-redhat-cloud-services';
import tsParser from '@typescript-eslint/parser';
import pluginCypress from 'eslint-plugin-cypress/flat';
import jestDom from 'eslint-plugin-jest-dom';
import jsdoc from 'eslint-plugin-jsdoc';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['node_modules/*', 'static/*', 'dist/*', 'docs/*']),
  fecPlugin,
  pluginCypress.configs.recommended,
  reactHooks.configs['recommended-latest'],
  jsdoc.configs['flat/recommended'],
  testingLibrary.configs['flat/react'],
  jestDom.configs['flat/recommended'],
  {
    languageOptions: {
      parser: tsParser,

      globals: {
        React: true,
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },

    rules: {
      'rulesdir/disallow-fec-relative-imports': 'off',
      'rulesdir/forbid-pf-relative-imports': 'off',
      'jsdoc/tag-lines': 0,
      'jsdoc/require-jsdoc': 0,
      'testing-library/no-node-access': 'off',
      'jsdoc/check-line-alignment': [
        'error',
        'always',
        {
          customSpacings: {
            postDelimiter: 2,
          },
        },
      ],
      'jsdoc/check-tag-names': [
        'warn',
        {
          definedTags: ['category', 'subcategory'],
        },
      ],
    },
  },
]);
