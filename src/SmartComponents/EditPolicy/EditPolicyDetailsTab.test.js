import EditPolicyDetailsTab, { useThresholdValidate } from './EditPolicyDetailsTab';

jest.mock('react', () => ({
    ...require.requireActual('react'),
    useState: () => (['state', () => ({})])
}));

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

describe('useThresholdValidate', () => {
    it('expect to render without error', () => {
        const [_, validator] = useThresholdValidate(); // eslint-disable-line
        expect(validator(100)).toBe(true);
    });
});
