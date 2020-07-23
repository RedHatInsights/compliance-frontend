import NoSystemsTableBody from './NoSystemsTableBody';

describe('NoSystemsTableBody', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <NoSystemsTableBody />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
