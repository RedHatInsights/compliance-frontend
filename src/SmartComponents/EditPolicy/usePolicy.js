import { useMutation } from '@apollo/react-hooks';
import {
    ASSOCIATE_SYSTEMS_TO_PROFILES, CREATE_BUSINESS_OBJECTIVE, UPDATE_PROFILE, CREATE_PROFILE, ASSOCIATE_RULES_TO_PROFILE
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

const usePolicy = () => {
    const createBusinessObjective = useCreateBusinessObjective();
    const [updateProfile] = useMutation(UPDATE_PROFILE);
    const [createProfile] = useMutation(CREATE_PROFILE);
    const [associateSystems] = useMutation(ASSOCIATE_SYSTEMS_TO_PROFILES);
    const [associateRules] = useMutation(ASSOCIATE_RULES_TO_PROFILE);

    return async (policy, updatedPolicy, onProgress) => {
        const selectedRuleRefIds = updatedPolicy?.selectedRuleRefIds || [];

        const expectedUpdates = 3 + selectedRuleRefIds.length;
        let progress = 0;
        const dispatchProgress = () => {
            if (onProgress) {
                onProgress((++progress) / expectedUpdates);
            }
        };

        const businessObjectiveId = await createBusinessObjective(policy, updatedPolicy?.businessObjective);
        dispatchProgress();

        let policyInput = {
            name: updatedPolicy.name,
            description: updatedPolicy.description,
            complianceThreshold: parseFloat(updatedPolicy.complianceThreshold)
        };

        if (businessObjectiveId) {
            policyInput.businessObjectiveId = businessObjectiveId;
        }

        if (policy === null) {
            policyInput.cloneFromProfileId = updatedPolicy.cloneFromProfileId;
            policyInput.refId = updatedPolicy.refId;
            policyInput.benchmarkId = updatedPolicy.benchmarkId;

            let {
                data: { createProfile: { profile: { id } } }
            } = await createProfile({ variables: { input: policyInput } });

            dispatchProgress();
            policy = { id };
        } else {
            policyInput.id = policy.id;

            await updateProfile({ variables: { input: policyInput } });
            dispatchProgress();
        }

        let { data: { associateSystems: { profile: { policy: { profiles } } } } } = await associateSystems({
            variables: { input: {
                id: policy.id,
                systemIds: updatedPolicy.hosts.map((h) => (h.id))
            } }
        });
        dispatchProgress();

        for (const { id, ruleRefIds } of selectedRuleRefIds) {
            let ruleInput = {
                id: profiles.find((profile) => (
                    profile.id === id || profile.parentProfileId === id
                )).id,
                ruleRefIds
            };

            await associateRules({ variables: { input: ruleInput } });
            dispatchProgress();
        }
    };
};

export default usePolicy;
