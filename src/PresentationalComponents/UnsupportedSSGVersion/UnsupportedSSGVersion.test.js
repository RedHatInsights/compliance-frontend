import UnsupportedSSGVersion from './UnsupportedSSGVersion';

describe('UnsupportedSSGVersion', () => {
    const defaultProps = {
        style: { margin: '1em' }
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <UnsupportedSSGVersion { ...defaultProps }>
                Unsupported text
            </UnsupportedSSGVersion>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render no warning sign', () => {
        const wrapper = shallow(
            <UnsupportedSSGVersion { ...defaultProps } showWarningIcon={ false }>
                Unsupported text
            </UnsupportedSSGVersion>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render tooltip', () => {
        const wrapper = shallow(
            <UnsupportedSSGVersion { ...defaultProps } tooltipText='TOOLTIP TEXT'>
                Unsupported text
            </UnsupportedSSGVersion>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render help sign', () => {
        const wrapper = shallow(
            <UnsupportedSSGVersion { ...defaultProps } showHelpIcon={ true }>
                Unsupported text
            </UnsupportedSSGVersion>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render singular message', () => {
        const wrapper = shallow(
            <UnsupportedSSGVersion { ...defaultProps } messageVariant='singular'>
                Unsupported text
            </UnsupportedSSGVersion>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
