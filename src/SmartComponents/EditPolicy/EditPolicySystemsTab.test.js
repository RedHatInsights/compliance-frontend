import EditPolicySystemsTab from './EditPolicySystemsTab.js';

const defaultProps = {
    policy: {
        id: 1,
        majorOsVersion: 8,
        hosts: [
            {
                id: 1
            }
        ]
    }
};

describe('EditPolicy', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <EditPolicySystemsTab { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
