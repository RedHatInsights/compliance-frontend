import { CREATE_BUSINESS_OBJECTIVE } from 'Utilities/graphql/mutations';

const businessObjectiveMutation = (businessObjective, editPolicyBusinessObjective, mutate) => {
    if (editPolicyBusinessObjective === undefined) {
        return Promise.resolve(businessObjective ? businessObjective.id : null);
    }

    if (editPolicyBusinessObjective && !editPolicyBusinessObjective.create && businessObjective
        && (editPolicyBusinessObjective.value !== businessObjective.id)) {
        return Promise.resolve(editPolicyBusinessObjective.value);
    }

    if (editPolicyBusinessObjective && !editPolicyBusinessObjective.create
        && businessObjective === null) {
        return Promise.resolve(editPolicyBusinessObjective.value);
    }

    if (editPolicyBusinessObjective === null) {
        return Promise.resolve(null);
    }

    if (editPolicyBusinessObjective.create) {
        return mutate({
            mutation: CREATE_BUSINESS_OBJECTIVE,
            variables: { input: { title: editPolicyBusinessObjective.label } }
        }).then((result) => {
            return result.data.createBusinessObjective.businessObjective.id;
        });
    }

    return Promise.resolve();
};

export default businessObjectiveMutation;
