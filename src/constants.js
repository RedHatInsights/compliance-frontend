import { version } from './../package.json';
export const COMPLIANCE_API_ROOT = '/api/compliance';
export const COMPLIANCE_WS_ROOT = process.env.NODE_ENV === 'production'
    ? 'wss://localhost:3000/cable'
    : 'ws://localhost:3000/cable';

export const API_HEADERS = {
    'X-Insights-Compliance': version,
    'Content-Type': 'application/json',
    Accept: 'application/json'
};

export const FILTER_CATEGORIES = [
    {
        type: 'checkbox', title: 'Compliant', urlParam: 'compliant', values: [
            { label: 'Compliant', value: true },
            { label: 'Non-compliant', value: false }
        ]
    },
    {
        type: 'checkbox', title: 'Compliance score', urlParam: 'complianceScore', values: [
            { label: '90 - 100%', value: '90-100' },
            { label: '70 - 89%', value: '70-89' },
            { label: '50 - 69%', value: '50-69' },
            { label: 'Less than 50%', value: '0-49' }
        ]
    }
];
