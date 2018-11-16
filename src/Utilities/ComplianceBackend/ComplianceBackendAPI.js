import { API_HEADERS, COMPLIANCE_API_ROOT } from '../../constants';

export const get = (path, apiProps) => {
    return window.insights.chrome.auth.getUser()
    .then(() => {
        return fetch(COMPLIANCE_API_ROOT.concat(path), {
            method: 'get',
            headers: API_HEADERS,
            body: JSON.stringify(apiProps)
        }).then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json();
        });
    });
};
