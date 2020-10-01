import EditPolicyDetailsTab from './EditPolicyDetailsTab';

describe('EditPolicyDetailsTab', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <EditPolicyDetailsTab policy={ {
                id: 'POLICY_ID',
                name: 'Policy Name',
                businessObjective: {
                    title: 'BO title',
                    id: 1
                },
                complianceThreshold: '30'
            }} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
