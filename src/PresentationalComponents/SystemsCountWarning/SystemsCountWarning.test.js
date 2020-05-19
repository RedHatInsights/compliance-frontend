import SystemsCountWarning from './SystemsCountWarning';

describe('SystemsCountWarning', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <SystemsCountWarning count={ 0 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render compact without error', () => {
        const wrapper = shallow(
            <SystemsCountWarning count={ 10 } variant='compact' />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render count without error', () => {
        const wrapper = shallow(
            <SystemsCountWarning count={ 0 } variant='count' />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render full without error', () => {
        const wrapper = shallow(
            <SystemsCountWarning count={ 0 } variant='full' />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
