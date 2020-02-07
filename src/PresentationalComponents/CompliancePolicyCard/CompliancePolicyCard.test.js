import toJson from 'enzyme-to-json';

import CompliancePolicyCard from './CompliancePolicyCard';

const defaultProps = {
    policy: {
        id: 'ID',
        refId: 'REF_ID',
        name: 'Test Policy',
        compliantHostCount: 10,
        complianceThreshold: 90,
        totalHostCount: 15,
        businessObjective: {
            title: 'BO'
        }
    }
};

describe('CompliancePolicyCard', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <CompliancePolicyCard { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('CompliancePolicyCard onMousover/onMouseout', () => {
    it('changes to state to the full policy name on hover and back to truncated', () => {
        const wrapper = shallow(
            <CompliancePolicyCard { ...defaultProps } />
        );
        const instance = wrapper.instance();

        instance.onMouseover();
        expect(wrapper.state()).toMatchSnapshot();

        instance.onMouseout();
        expect(wrapper.state()).toMatchSnapshot();
    });
});

