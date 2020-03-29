import toJson from 'enzyme-to-json';

import { useQuery } from '@apollo/react-hooks';
jest.mock('@apollo/react-hooks');

import { EditPolicyRules } from './EditPolicyRules.js';

describe('EditPolicyRules', () => {
    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({
            data: {
                profile: {
                    refId: 'refID-test', name: 'test profile', rules: [{ refId: 'xccdfrefid' }]
                },
                benchmark: {
                    rules: [{ refId: 'xccdfrefid' }]
                }
            },
            error: false, loading: false }));
        const component = shallow(
            <EditPolicyRules />
        );
        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to render without error on error', () => {
        useQuery.mockImplementation(() => ({ data: {
            profile: { refId: 'refID-test', name: 'test profile' }
        }, error: true, loading: false }));
        const component = shallow(
            <EditPolicyRules />
        );
        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to render without error on loading', () => {
        useQuery.mockImplementation(() => ({ data: {
            profile: { refId: 'refID-test', name: 'test profile' }
        }, error: false, loading: true }));
        const component = shallow(
            <EditPolicyRules />
        );
        expect(toJson(component)).toMatchSnapshot();
    });
});
