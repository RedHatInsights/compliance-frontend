import { GreySmallText, Name, OperatingSystem, CompliantSystems } from './Cells';

describe('GreySmallText', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <GreySmallText>
                <span>THIS IS A TEST</span>
            </GreySmallText>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('Name', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <Name { ...{
                id: 'ID',
                name: 'NAME',
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
            <CompliantSystems totalHostCount={ 10 } compliantHostCount={ 9 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
