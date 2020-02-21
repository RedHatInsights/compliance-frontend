import toJson from 'enzyme-to-json';

import ReportsSystems from './ReportsSystems.js';

jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () =>
    () => 'Mocked ComplianceSystemDetails'
);

describe('ReportsSystems', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ReportsSystems />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
