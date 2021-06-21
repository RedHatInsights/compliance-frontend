import ErrorCard from './ErrorCard';

describe('ErrorCard', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ErrorCard />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render with error', () => {
        const wrapper = shallow(
            <ErrorCard errorMsg="Some kind of error" />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
