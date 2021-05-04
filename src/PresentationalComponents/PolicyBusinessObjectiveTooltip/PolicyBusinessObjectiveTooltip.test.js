import PolicyBusinessObjectiveTooltip from './PolicyBusinessObjectiveTooltip';

describe('PolicyBusinessObjectiveTooltip', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <PolicyBusinessObjectiveTooltip />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
