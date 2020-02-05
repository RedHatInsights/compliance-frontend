import toJson from 'enzyme-to-json';

import { useQuery } from '@apollo/react-hooks';
jest.mock('@apollo/react-hooks');

import { EditPolicyRules } from './EditPolicyRules.js';

jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () => {
    const RulesTable = () => 'Rules Table';
    return RulesTable;
});

describe('EditPolicyRules', () => {
    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({ data: {
            profile: { refId: 'refID-test', name: 'test profile' }
        }, error: false, loading: false }));
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
