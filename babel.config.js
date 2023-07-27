const IconMapper = {
  AnsibeTowerIcon: 'ansibeTower-icon',
};

module.exports = {
  env: {
    componentTest: {
      plugins: ['istanbul'],
    },
  },
  presets: [
    [
      '@babel/env',
      {
        targets: '> 0.25%, not dead',
      },
    ],
    '@babel/react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-lodash',
    [
      'transform-imports',
      {
        '@patternfly/react-icons': {
          transform: (importName) =>
            `@patternfly/react-icons/dist/esm/icons/${
              IconMapper[importName] ||
              importName
                .split(/(?=[A-Z])/)
                .join('-')
                .toLowerCase()
            }.js`,
          preventFullImport: true,
        },
        '@patternfly/react-table': {
          skipDefaultConversion: true,
          transform: `@patternfly/react-table/dist/esm`,
        },
        '@redhat-cloud-services/frontend-components': {
          transform: '@redhat-cloud-services/frontend-components/',
          preventFullImport: true,
          skipDefaultConversion: true,
        },
        '@redhat-cloud-services/frontend-components-notifications': {
          transform: '@redhat-cloud-services/frontend-components-notifications',
          preventFullImport: true,
          skipDefaultConversion: true,
        },
      },
    ],
  ],
};
