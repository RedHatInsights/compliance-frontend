import PolicyThresholdTooltip from './PolicyThresholdTooltip';

describe('PolicyThresholdTooltip', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <PolicyThresholdTooltip />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
