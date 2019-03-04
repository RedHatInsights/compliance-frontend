import { API_HEADERS, COMPLIANCE_API_ROOT } from '../../constants';

export const post = (path, apiProps) => {
    return fetch(COMPLIANCE_API_ROOT.concat(path), {
        method: 'post',
        headers: API_HEADERS,
        body: JSON.stringify(apiProps)
    }).then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return response.json();
    });
};
