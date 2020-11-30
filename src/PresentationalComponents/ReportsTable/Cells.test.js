import { Name, OperatingSystem, CompliantSystems } from './Cells';

describe('Name', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <Name { ...{
                id: 'ID',
                name: 'NAME',
                policyType: 'POLICY_TYPE',
                policy: {
                    id: 'POLICY_ID',
                    name: 'POLICY_NAME'
                }
            }} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('OperatingSystem', () => {
    const defaultProps = {
        majorOsVersion: 7
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <OperatingSystem { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render with SSG version', () => {
        const wrapper = shallow(
            <OperatingSystem { ...defaultProps } ssgVersion='1.2.3' />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render with unsupported warning', () => {
        const wrapper = shallow(
            <OperatingSystem { ...defaultProps } ssgVersion='1.2.3' supported={ false } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('CompliantSystems', () => {
    const deftaultProps = {
        testResultHostCount: 10,
        compliantHostCount: 9
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <CompliantSystems { ...deftaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render with unsupported hosts', () => {
        const wrapper = shallow(
            <CompliantSystems { ...deftaultProps } unsupportedHostCount={ 42 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
