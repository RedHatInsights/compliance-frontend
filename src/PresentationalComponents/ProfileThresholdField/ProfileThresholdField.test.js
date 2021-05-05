import { ProfileThresholdField } from './ProfileThresholdField';

describe('ProfileThresholdField', () => {
    const defaultProps = {
        previousThreshold: 10
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <ProfileThresholdField { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to handle ThresholdChange', () => {
        const wrapper = shallow(
            <ProfileThresholdField { ...defaultProps }/>
        );
        const instance = wrapper.instance();

        instance.handleThresholdChange(100);
        expect(wrapper.state()).toMatchSnapshot();

        instance.handleThresholdChange(50);
        expect(wrapper.state()).toMatchSnapshot();

        instance.handleThresholdChange(0);
        instance.handleThresholdChange(-10);
        expect(wrapper.state()).toMatchSnapshot();
    });
});
