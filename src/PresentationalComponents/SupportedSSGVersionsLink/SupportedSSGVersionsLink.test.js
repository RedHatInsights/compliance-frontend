import SupportedSSGVersionsLink from './SupportedSSGVersionsLink';

describe('SupportedSSGVersionsLink', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <SupportedSSGVersionsLink count={ 0 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
