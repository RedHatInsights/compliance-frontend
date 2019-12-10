import toJson from 'enzyme-to-json';

import SystemsComplianceFilter from './SystemsComplianceFilter';

const defaultProps = {
    updateFilter: jest.fn()
};

describe('SystemsComplianceFilter', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <SystemsComplianceFilter { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('buildFilter', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <SystemsComplianceFilter { ...defaultProps }
                compliant={
                    ['YES', 'NO']
                }
                complianceScore={[
                    '10-20',
                    '30-40'
                ]} />
        );
        const instance = wrapper.instance();
        expect(instance.buildFilter()).toMatchSnapshot();
    });
});

describe('addFilter', () => {
    it('adds filters to state', () => {
        const wrapper = shallow(
            <SystemsComplianceFilter { ...defaultProps } />
        );
        const instance = wrapper.instance();

        expect(wrapper.state()).toMatchSnapshot();
        instance.addFilter('compliant', 'Sure');
        expect(wrapper.state()).toMatchSnapshot();
        expect(defaultProps.updateFilter).toHaveBeenCalled();

        expect(wrapper.state()).toMatchSnapshot();
        instance.addFilter('complianceScore', '10-20');
        expect(wrapper.state()).toMatchSnapshot();
        expect(defaultProps.updateFilter).toHaveBeenCalled();

    });
});

describe('removeFilter', () => {
    it('removes filters from state', () => {
        const wrapper = shallow(
            <SystemsComplianceFilter { ...defaultProps }
                compliant={
                    ['YES', 'NO']
                }
                complianceScore={[
                    '10-20',
                    '30-40'
                ]} />
        );
        const instance = wrapper.instance();

        expect(wrapper.state()).toMatchSnapshot();
        instance.removeFilter('compliant', 'YES');
        expect(wrapper.state()).toMatchSnapshot();
        expect(defaultProps.updateFilter).toHaveBeenCalled();

        expect(wrapper.state()).toMatchSnapshot();
        instance.removeFilter('complianceScore', '10-20');
        expect(wrapper.state()).toMatchSnapshot();
        expect(defaultProps.updateFilter).toHaveBeenCalled();

    });
});
