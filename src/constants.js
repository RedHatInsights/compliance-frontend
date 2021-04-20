import { version } from './../package.json';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const DEFAULT_TITLE = 'Compliance | Red Hat Insights';
export const DEFAULT_TITLE_SUFFIX = ` - ${ DEFAULT_TITLE }`;

export const COMPLIANCE_API_ROOT = '/api/compliance';
export const COMPLIANCE_UI_ROOT = '/rhel/compliance';
export const INVENTORY_API_ROOT = '/api/inventory/v1';

export const API_HEADERS = {
    'X-Insights-Compliance': version,
    'Content-Type': 'application/json',
    Accept: 'application/json'
};

export const DEFAULT_SYSTEMS_FILTER_CONFIGURATION = [
    {
        type: conditionalFilterType.text,
        label: 'Name',
        filterString: (value) => (`name ~ ${value}`)
    }
];

export const systemsPolicyFilterConfiguration = (policies) => ([{
    type: conditionalFilterType.checkbox,
    label: 'Policy',
    filterString: (value) => `policy_id = ${value}`,
    items: policies.map((policy) => ({
        label: policy.name,
        value: policy.id
    }))
}]);

const majorOsVersionsFromProfiles = (policies) => (
    Array.from(new Set(policies.map((profile) => (
        profile.majorOsVersion
    ))))
);

export const systemsOsFilterConfiguration = (policies) => ([{
    type: conditionalFilterType.checkbox,
    label: 'Operating system',
    filterString: (value) => (`os_major_version = ${value}`),
    items: majorOsVersionsFromProfiles(policies).map(osVersion => ({
        label: `RHEL ${osVersion}`,
        value: osVersion
    }))
}]);

const toSystemsOsMinorFilterConfigurationItem = (osVersions) => (
    (majorVersion) => ({
        label: `RHEL ${ majorVersion }`,
        value: majorVersion,
        items: osVersions[majorVersion].map((minorVersion) => ({
            label: `RHEL ${ majorVersion }.${ minorVersion }`,
            value: minorVersion
        }))
    })
);

export const systemsOsMinorFilterConfiguration = (osMajorVersions) => {
    const filterString = (value) => ([
        Object.keys(value).flatMap((majorVersion) => (
            Object.keys(value[majorVersion]).map((minorVersion) => (
                value[majorVersion][minorVersion] &&
                    `(os_major_version = ${ majorVersion } AND os_minor_version = ${ minorVersion })`
            ))
        )).filter((v) => (!!v)).join(' OR ')
    ]);
    const items = Object.keys(osMajorVersions).map(toSystemsOsMinorFilterConfigurationItem(osMajorVersions));

    return [{
        type: conditionalFilterType.group,
        label: 'Operating system',
        filterString,
        items
    }];
};

export const COMPLIANT_SYSTEMS_FILTER_CONFIGURATION = [
    {
        type: conditionalFilterType.checkbox,
        label: 'Compliant',
        filterString: (value) => (`compliant = ${value}`),
        items: [
            { label: 'Compliant', value: 'true' },
            { label: 'Non-compliant', value: 'false' }
        ]
    },
    {
        type: conditionalFilterType.checkbox,
        label: 'Compliance score',
        filterString: (value) => {
            const scoreRange = value.split('-');
            return `compliance_score >= ${scoreRange[0]} and compliance_score <= ${scoreRange[1]}`;
        },
        items: [
            { label: '90 - 100%', value: '90-100' },
            { label: '70 - 89%', value: '70-89' },
            { label: '50 - 69%', value: '50-69' },
            { label: 'Less than 50%', value: '0-49' }
        ]
    }
];

export const features = {
    showSsgVersions: true,
    newInventory: true
};
