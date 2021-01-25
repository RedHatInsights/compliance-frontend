const IconMapper = {
    AnsibeTowerIcon: 'ansibeTower-icon'
};

module.exports = {
    presets: [
        [
            '@babel/env',
            {
                targets: '> 0.25%, not dead'
            }
        ],
        '@babel/react'
    ],
    plugins: [
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true
            }
        ],
        '@babel/plugin-transform-runtime',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        'babel-plugin-lodash',
        '@babel/plugin-transform-react-display-name',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        [
            'transform-imports', {
                '@patternfly/react-icons': {
                    transform: (importName) => (
                        `@patternfly/react-icons/dist/esm/icons/${IconMapper[importName] || importName
                        .split(/(?=[A-Z])/)
                        .join('-')
                        .toLowerCase()}.js`
                    )
                }
            },
            'react-icons'
        ], [
            'transform-imports', {
                '@redhat-cloud-services/frontend-components': {
                    transform: '@redhat-cloud-services/frontend-components/components/esm',
                    preventFullImport: true,
                    skipDefaultConversion: true
                },
                '@redhat-cloud-services/frontend-components-notifications': {
                    transform: '@redhat-cloud-services/frontend-components-notifications/esm',
                    preventFullImport: true,
                    skipDefaultConversion: true
                }
            }
        ]

    ]
};
