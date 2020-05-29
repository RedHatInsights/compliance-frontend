import { useQuery } from '@apollo/react-hooks';
jest.mock('@apollo/react-hooks');

import { EditPolicyRules } from './EditPolicyRules.js';

describe('EditPolicyRules', () => {
    const data = {
        profile: {
            refId: 'refID-test', name: 'test profile', rules: [{ refId: 'xccdfrefid' }]
        },
        benchmark: {
            rules: [{ refId: 'xccdfrefid' }]
        }
    };

    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({ data, error: undefined, loading: undefined }));
        const component = shallow(
            <EditPolicyRules />
        );
        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to render with error on error', () => {
        useQuery.mockImplementation(() => ({ data: undefined, error: true, loading: undefined }));
        const component = shallow(
            <EditPolicyRules />
        );
        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to render without error on loading', () => {
        useQuery.mockImplementation(() => ({ data: undefined, error: undefined, loading: true }));
        const component = shallow(
            <EditPolicyRules />
        );
        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({ data, error: undefined, loading: undefined }));
        const component = shallow(
            <EditPolicyRules selectedRuleRefIds={ ['xccdfrefid'] } />
        );
        expect(toJson(component)).toMatchSnapshot();
    });
});
