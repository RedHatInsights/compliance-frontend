import businessObjectiveMutation from './businessObjectiveMutation';

describe('.handleBusinessObjective', () => {
    const defaultArgs = {
        businessObjective: {
            title: 'Test Objective',
            id: '1'
        },
        editPolicyBusinessObjective: {
            title: 'Edited Test Objective',
            value: '2'
        },
        mutate: jest.fn()
    };

    it('returns the businessObjective.id if editPolicyBusinessObjective is undefined', () => {
        businessObjectiveMutation(defaultArgs.businessObjective, undefined, defaultArgs.mutate).then((resultId) => {
            expect(resultId).toBe(defaultArgs.businessObjective.id);
        });
    });

    it('returns null if editPolicyBusinessObjective is undefined and no businessObjective', () => {
        businessObjectiveMutation(null, null, defaultArgs.mutate).then((resultId) => {
            expect(resultId).toBe(null);
        });
    });

    it('returns the editPolicyBusinessObjective.value if it is defined and businessObjective is null', () => {
        businessObjectiveMutation(null, defaultArgs.editPolicyBusinessObjective, defaultArgs.mutate).then((resultId) => {
            expect(resultId).toBe(defaultArgs.editPolicyBusinessObjective.value);
        });
    });

    it('returns the editPolicyBusinessObjective.value if it and businessObjective is defined', () => {
        businessObjectiveMutation(
            defaultArgs.businessObjective, defaultArgs.editPolicyBusinessObjective, defaultArgs.mutate
        ).then((resultId) => {
            expect(resultId).toBe(defaultArgs.editPolicyBusinessObjective.value);
        });
    });

    it('returns null when editPolicyBusinessObjective is null', () => {
        businessObjectiveMutation(defaultArgs.businessObjective, null, defaultArgs.mutate).then((resultId) => {
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
        await businessObjectiveMutation(undefined, { create: true, label: title }, mutate).then((resultId) => {
            expect(resultId).toBe('3');
        });
        expect(mutate).toHaveBeenCalled();
    });
});
