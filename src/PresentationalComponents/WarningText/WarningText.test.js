import WarningText from './WarningText';

describe('WarningText', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <WarningText>
                Test Warning Text
            </WarningText>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
