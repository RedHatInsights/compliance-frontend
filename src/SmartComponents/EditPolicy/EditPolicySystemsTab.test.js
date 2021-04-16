import EditPolicySystemsTab from './EditPolicySystemsTab.js';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => ([]))
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
        location: {}
    })
}));

describe('EditPolicySystemsTab', () => {
    const defaultProps = {
        osMajorVersion: '7',
        newRuleTabs: false
    };

    it('expect to render without error', async () => {
        const wrapper = shallow(
            <EditPolicySystemsTab { ...defaultProps } />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render with new tabs alert', async () => {
        const wrapper = shallow(
            <EditPolicySystemsTab { ...defaultProps } newRuleTabs={ true } />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
