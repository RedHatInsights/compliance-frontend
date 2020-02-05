import toJson from 'enzyme-to-json';

jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () =>
    () => 'Mocked ComplianceSystemDetails'
);

import ComplianceSystems from './ComplianceSystems.js';

describe('ComplianceSystems', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ComplianceSystems />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
