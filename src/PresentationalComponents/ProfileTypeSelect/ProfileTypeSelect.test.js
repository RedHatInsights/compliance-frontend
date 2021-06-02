import ProfileTypeSelect from './ProfileTypeSelect';

describe('ProfileTypeSelect', () => {
    const defaultProps = {
        profiles: [
            { description: 'foodesc', name: 'fooname', id: 'fooid' },
            { description: 'foodesc', name: 'fooname', id: 'fooid', disabled: true }
        ]
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <ProfileTypeSelect { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
