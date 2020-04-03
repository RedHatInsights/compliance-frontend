import toJson from 'enzyme-to-json';

import CompliancePoliciesEmptyState from './CompliancePoliciesEmptyState';
jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () => {
    const ComplianceRemediationButton = () => <button>Remediations</button>;
    return ComplianceRemediationButton;
});

describe('CompliancePoliciesEmptyState', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <CompliancePoliciesEmptyState />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
