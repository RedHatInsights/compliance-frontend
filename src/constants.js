import { version } from './../package.json';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';

export const COMPLIANCE_API_ROOT = '/api/compliance';
export const COMPLIANCE_UI_ROOT = '/rhel/compliance';
export const COMPLIANCE_WS_ROOT = process.env.NODE_ENV === 'production'
    ? 'wss://localhost:3000/cable'
    : 'ws://localhost:3000/cable';
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
        event: 'onSubmit',
        filterString: (value) => (`name ~ ${value}`)
    }
];

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
