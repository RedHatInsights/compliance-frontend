import SSGVersionWarning from './SSGVersionWarning';

describe('SSGVersionWarning', () => {
    const defaultProps = {
        style: { margin: '1em' }
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <SSGVersionWarning { ...defaultProps }>
                Warning text
            </SSGVersionWarning>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render no warning sign', () => {
        const wrapper = shallow(
            <SSGVersionWarning { ...defaultProps } showWarningIcon={ false }>
                Warning text
            </SSGVersionWarning>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render tooltip', () => {
        const wrapper = shallow(
            <SSGVersionWarning { ...defaultProps } tooltipText='TOOLTIP TEXT'>
                Warning text
            </SSGVersionWarning>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render help sign', () => {
        const wrapper = shallow(
            <SSGVersionWarning { ...defaultProps } showHelpIcon={ true }>
                Warning text
            </SSGVersionWarning>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
