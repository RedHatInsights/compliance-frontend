require.extensions['.css'] = () => undefined;
const path = require('path');
const glob = require('glob');

const mapper = {
    TextVariants: 'Text',
    ButtonVariant: 'Button',
    PaginationVariant: 'Pagination',
    SelectVariant: 'selectConstants',
    EmptyStateVariant: 'EmptyState',
    DropdownPosition: 'dropdownConstants',
    TextListVariants: 'TextList',
    TextListItemVariants: 'TextListItem',
    ClipboardCopyVariant: 'ClipboardCopy',
    TooltipPosition: 'Tooltip',
    ModalVariant: 'Modal',
    ProgressVariant: 'Progress',
    PopoverPosition: 'Popover',
    PageSectionVariants: 'PageSection'
};

const frontendComponentsMappe = {
    CullingInformation: 'CullingInfo',
    CriticalBattery: 'Battery',
    HighBattery: 'Battery',
    MediumBattery: 'Battery',
    LowBattery: 'Battery',
    NullBattery: 'Battery',
    ConnectedBreadcrumbs: 'Breadcrumbs',
    conditionalFilterType: 'ConditionalFilter',
    groupType: 'ConditionalFilter',
    DarkContext: 'Dark',
    FilterDropdown: 'Filters',
    FilterInput: 'Filters',
    LabeledInput: 'Input',
    PageHeaderTitle: 'PageHeader',
    dropDirection: 'Pagination',
    SkeletonSize: 'Skeleton',
    SortDirection: 'Table',
    TableVariant: 'Table',
    TableHeader: 'Table',
    TableBody: 'Table',
    TableFooter: 'Table'
};

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
            'transform-imports',
            {
                '@patternfly/react-core': {
                    transform: (importName, matches) => {
                        let res;
                        const files = glob.sync(path.resolve(__dirname, `./node_modules/@patternfly/react-core/dist/js/**/${mapper[importName] || importName}.js`));
                        if (files.length > 0) {
                            res = files[0];
                        } else {
                            throw `File with importName ${importName} does not exist`;
                        }

                        res = res.replace(path.resolve(__dirname, './node_modules/'), '');
                        res = res.replace(/^\//, '');
                        return res;
                    },
                    skipDefaultConversion: true
                }
            },
            'react-core'
        ], [
            'transform-imports', {
                '@patternfly/react-icons': {
                    transform: (importName) => (
                        `@patternfly/react-icons/dist/js/icons/${IconMapper[importName] || importName
                        .split(/(?=[A-Z])/)
                        .join('-')
                        .toLowerCase()}.js`
                    )
                }
            },
            'react-icons'
        ], [
            'transform-imports',
            {
                '@redhat-cloud-services/frontend-components': {
                    transform: (importName, matches) => `@redhat-cloud-services/frontend-components/components/cjs/${frontendComponentsMappe[importName] || importName}.js`,
                    skipDefaultConversion: true
                }
            },
            'frontend-components'
        ]

    ]
};