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
        policyOsMinorVersions: [1, 2, 3]
    };

    it('expect to render without error', async () => {
        const wrapper = shallow(
            <EditPolicySystemsTab { ...defaultProps } />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
