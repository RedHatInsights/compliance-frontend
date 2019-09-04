import toJson from 'enzyme-to-json';

import SystemsComplianceFilter from './SystemsComplianceFilter';

describe('SystemsComplianceFilter', () => {
    const defaultProps = {
        updateFilter: jest.fn()
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <SystemsComplianceFilter { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
