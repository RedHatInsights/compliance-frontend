import { API_HEADERS, COMPLIANCE_API_ROOT } from '../../constants';

export const getProfiles = apiProps => {
    return window.insights.chrome.auth.getUser()
    .then(() => {
        return fetch(COMPLIANCE_API_ROOT.concat('/profiles'), {
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
