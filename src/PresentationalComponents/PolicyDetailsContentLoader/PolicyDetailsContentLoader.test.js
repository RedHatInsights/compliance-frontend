import PolicyDetailsContentLoader from './PolicyDetailsContentLoader';

describe('PolicyDetailsContentLoader', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <PolicyDetailsContentLoader />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
