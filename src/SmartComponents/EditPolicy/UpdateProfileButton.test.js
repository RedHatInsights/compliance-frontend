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

    describe('.handleBusinessObjective', () => {
        it('returns the businessObjective.id if editPolicyBusinessObjective is undefined', () => {
            const wrapper = shallow(
                <UpdateProfileButton { ...defaultProps }
                    editPolicyBusinessObjective={ undefined } />
            );
            const instance = wrapper.instance();

            instance.handleBusinessObjective().then((resultId) => {
                expect(resultId).toBe(defaultProps.businessObjective.id);
            });
        });

        it('returns null if editPolicyBusinessObjective is undefined and no businessObjective', () => {
            const wrapper = shallow(
                <UpdateProfileButton { ...defaultProps }
                    businessObjective={ undefined }
                    editPolicyBusinessObjective={ undefined } />
            );
            const instance = wrapper.instance();

            instance.handleBusinessObjective().then((resultId) => {
                expect(resultId).toBe(null);
            });
        });

        it('returns the editPolicyBusinessObjective.value if it is defined and businessObjective is null', () => {
            const wrapper = shallow(
                <UpdateProfileButton { ...defaultProps }
                    businessObjective={ null } />
            );
            const instance = wrapper.instance();

            instance.handleBusinessObjective().then((resultId) => {
                expect(resultId).toBe(defaultProps.editPolicyBusinessObjective.value);
            });
        });

        it('returns the editPolicyBusinessObjective.value if it and businessObjective is defined', () => {
            const wrapper = shallow(
                <UpdateProfileButton { ...defaultProps } />
            );
            const instance = wrapper.instance();

            instance.handleBusinessObjective().then((resultId) => {
                expect(resultId).toBe(defaultProps.editPolicyBusinessObjective.value);
            });
        });

        it('returns null when editPolicyBusinessObjective is null', () => {
            const wrapper = shallow(
                <UpdateProfileButton { ...defaultProps }
                    editPolicyBusinessObjective={ null } />
            );
            const instance = wrapper.instance();

            instance.handleBusinessObjective().then((resultId) => {
                expect(resultId).toBe(null);
            });
        });

        it('returns a new ID if editPolicyBusinessObjective has a create property and mutates', async () => {
            const title = 'New Objective';
            const mutate = jest.fn((query) => {
                let id;

                if (query.variables.input.title === title)  {
                    id = '3';
                } else {
                    id = null;
                }

                return Promise.resolve({
                    data: {
                        createBusinessObjective: {
                            businessObjective: {
                                id
                            }
                        }
                    }
                });
            });
            const wrapper = shallow(
                <UpdateProfileButton { ...defaultProps }
                    mutate={ mutate }
                    businessObjective={ undefined }
                    editPolicyBusinessObjective={ {
                        create: true,
                        label: title
                    } } />
            );
            const instance = wrapper.instance();

            await instance.handleBusinessObjective().then((resultId) => {
                expect(resultId).toBe('3');
            });
            expect(mutate).toHaveBeenCalled();
        });
    });

    describe('.onClick', () => {
        it('calls mutate and onClick', async () => {
            const mutate = jest.fn();
            const hBO = jest.fn(() => Promise.resolve(1));
            const wrapper = shallow(
                <UpdateProfileButton { ...defaultProps } mutate={ mutate } />
            );
            wrapper.instance().handleBusinessObjective = hBO;
            wrapper.update();

            await wrapper.instance().onClick();

            expect(mutate).toHaveBeenCalled();
            expect(hBO).toHaveBeenCalled();
        });
    });
});
