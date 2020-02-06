import toJson from 'enzyme-to-json';

jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () => {
    const ComplianceRemediationButton = () => <button>Remediations</button>;
    return ComplianceRemediationButton;
});

import { EditPolicy } from './EditPolicy.js';

describe('EditPolicy', () => {
    const defaultProps = {
        policyId: 'POLICY_ID',
        businessObjective: {
            title: 'BO title',
            id: 1
        },
        complianceThreshold: '30',
        onClose: jest.fn(),
        dispatch: jest.fn()
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <EditPolicy { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
