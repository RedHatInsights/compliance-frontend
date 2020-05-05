import ReportCard from './ReportCard';

const defaultProps = {
    profile: {
        id: 'ID',
        refId: 'REF_ID',
        name: 'Test Policy',
        compliantHostCount: 10,
        totalHostCount: 15,
        policy: {
            id: 'policyid',
            benchmark: {
                version: '0.1.4'
            }
        },
        businessObjective: {
            title: 'BO'
        },
        benchmark: {
            version: '0.1.5'
        }
    }
};

describe('ReportCard', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ReportCard { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ReportCard onMousover/onMouseout', () => {
    it('changes to state to the full policy name on hover and back to truncated', () => {
        const wrapper = shallow(
            <ReportCard { ...defaultProps } />
        );
        const instance = wrapper.instance();

        instance.onMouseover();
        expect(wrapper.state()).toMatchSnapshot();

        instance.onMouseout();
        expect(wrapper.state()).toMatchSnapshot();
    });
});

