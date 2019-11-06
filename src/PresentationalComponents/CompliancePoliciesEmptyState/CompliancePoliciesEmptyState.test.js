import toJson from 'enzyme-to-json';

import CompliancePoliciesEmptyState from './CompliancePoliciesEmptyState';

describe('CompliancePoliciesEmptyState', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <CompliancePoliciesEmptyState />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
