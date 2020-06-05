import { UpdateProfileButton } from './UpdateProfileButton';

describe('UpdateProfileButton', () => {
    const defaultProps = {
        businessObjective: {
            title: 'Test Objective',
            id: '1'
        },
        policyId: '12345',
        editPolicyBusinessObjective: {
            title: 'Edited Test Objective',
            value: '2'
        },
        mutate: jest.fn(),
        onClick: jest.fn()
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <UpdateProfileButton { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('.onClick', () => {
        it('calls mutate and onClick', async () => {
            const mutate = jest.fn();
            const wrapper = shallow(
                <UpdateProfileButton { ...defaultProps } mutate={ mutate } />
            );
            wrapper.update();

            await wrapper.instance().onClick();

            expect(mutate).toHaveBeenCalled();
        });
    });
});
