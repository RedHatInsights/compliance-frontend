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
    it('expect to render without error', () => {
        const wrapper = shallow(
            <OperatingSystem majorOsVersion="7" />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('CompliantSystems', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <CompliantSystems testResultHostCount={ 10 } compliantHostCount={ 9 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
