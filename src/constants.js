/* eslint max-len: 0 */
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

import React from 'react';
import {
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    QuestionCircleIcon
} from '@patternfly/react-icons';

export const REMEDIATIONS_COLUMN = 4;
export const COMPLIANT_COLUMN = 3;
export const SEVERITY_COLUMN = 2;
export const POLICY_COLUMN = 1;
export const TITLE_COLUMN = 0;

const LowSeverityIcon = <svg width="1em" height="1em" viewBox="0 0 18 18" role="img" style={ { verticalAlign: '-0.125em' } } xmlns="http://www.w3.org/2000/svg"><path d="M2 0h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6.67 10.46a1.67 1.67 0 1 0 0 3.338 1.67 1.67 0 0 0 0-3.338zm-1.586-6l.27 4.935a.435.435 0 0 0 .434.411H9.55c.232 0 .422-.18.435-.411l.27-4.936A.435.435 0 0 0 9.818 4h-2.3c-.25 0-.448.21-.435.46z" fill="#3A9CA6" fillRule="evenodd"/></svg>;

export const HIGH_SEVERITY = <React.Fragment><ExclamationCircleIcon className='ins-u-failed'/> High</React.Fragment>;
export const MEDIUM_SEVERITY = <React.Fragment><ExclamationTriangleIcon className='ins-u-warning'/> Medium</React.Fragment>;
export const LOW_SEVERITY = <React.Fragment>{ LowSeverityIcon } Low</React.Fragment>;
export const UNKNOWN_SEVERITY = <React.Fragment><QuestionCircleIcon /> Unknown</React.Fragment>;

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
        groupSelectable: true,
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

export const features = {};
