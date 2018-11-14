import { version } from './../package.json';
export const COMPLIANCE_API_ROOT = 'https://prod.foo.redhat.com:1337/r/insights/platform/compliance';
export const COMPLIANCE_WS_ROOT = process.env.NODE_ENV === 'production'
    ? 'wss://localhost:3000/cable'
    : 'ws://localhost:3000/cable';

export const API_HEADERS = {
    'X-Insights-Compliance': version,
    'Content-Type': 'application/json',
    Accept: 'application/json'
};
