import ApiClient from './ApiClient';
import { COMPLIANCE_API_ROOT } from '@/constants';

describe('ApiClient', () => {
    it('returns an instance', () => {
        const client = new ApiClient({
            apiBase: COMPLIANCE_API_ROOT,
            authenticate: () => (
                console.log('lol')
            ),
            onUnauthorised: () => {
                console.log('logout')
            }
        });

        expect(client).toMatchSnapshot();
    });
});
