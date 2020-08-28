import { useMutation } from '@apollo/react-hooks';
import {
    ASSOCIATE_SYSTEMS_TO_PROFILES, CREATE_BUSINESS_OBJECTIVE, UPDATE_PROFILE
} from 'Utilities/graphql/mutations';

const useCreateBusinessObjective = () => {
    const [create] = useMutation(CREATE_BUSINESS_OBJECTIVE);

    return async (policy, newBusinessObjective) => {
        if (policy?.businessObjective?.title === newBusinessObjective?.title) {
            return policy?.businessObjective?.id;
        } else if (newBusinessObjective?.title === '') {
            return null;
        } else {
            const businessObjective = await create({ variables: {
                input: { title: newBusinessObjective.title }
            } });

            return businessObjective.data.createBusinessObjective.businessObjective.id;
        }
    };
};

const usePolicyUpdate = () => {
    const createBusinessObjective = useCreateBusinessObjective();
    const [updateProfile] = useMutation(UPDATE_PROFILE);
    const [associateSystems] = useMutation(ASSOCIATE_SYSTEMS_TO_PROFILES);

    return async (policy, updatedPolicy) => {
        const updatePolicyInput = {
            id: policy.id,
            name: updatedPolicy.name,
            description: updatedPolicy.description,
            complianceThreshold: parseFloat(updatedPolicy.complianceThreshold),
            businessObjectiveId: await createBusinessObjective(policy, updatedPolicy?.businessObjective)
        };

        associateSystems({
            variables: { input: {
                id: policy.id,
                systemIds: updatedPolicy.hosts.map((h) => (h.id))
            } }
        });

        return await updateProfile({ variables: { input: updatePolicyInput } });
    };
};

export default usePolicyUpdate;
