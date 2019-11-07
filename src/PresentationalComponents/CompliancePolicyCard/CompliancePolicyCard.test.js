import toJson from 'enzyme-to-json';

import CompliancePolicyCard from './CompliancePolicyCard';

describe('CompliancePolicyCard', () => {
    const defaultProps = {
        policy: {
            id: 'ID',
            refId: 'REF_ID',
            name: 'Test Policy',
            compliantHostCount: 10,
            totalHostCount: 15,
            businessObjective: {
                title: 'BO'
            }
        }
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <CompliancePolicyCard { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
