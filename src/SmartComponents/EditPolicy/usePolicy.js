import { useMutation } from '@apollo/client';
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
            const { data, error } = await create({ variables: {
                input: { title: newBusinessObjective.title }
            } });

            if (error) { throw error; }

            return data.createBusinessObjective.businessObjective.id;
        }
    };
};

const useAssociateSystems = () => {
    const [associateSystems] = useMutation(ASSOCIATE_SYSTEMS_TO_PROFILES);

    return async ({ id }, hosts) => {
        const { data, error } = await associateSystems({
            variables: { input: {
                id,
                systemIds: hosts.map((h) => (h.id))
            } }
        });

        if (error) { throw error; }

        return data?.associateSystems?.profile;
    };
};

const useAssociateRules = () => {
    const [associateRules] = useMutation(ASSOCIATE_RULES_TO_PROFILE);

    return async ({ id, ruleRefIds }, profiles) => {
        const profile = profiles.find((profile) => (
            profile.id === id || profile.parentProfileId === id
        ));
        const ruleInput = {
            id: profile?.id,
            ruleRefIds
        };

        const { error } = await associateRules({ variables: { input: ruleInput } });
        if (error) { throw error; }
    };
};

const usePolicy = () => {
    const createBusinessObjective = useCreateBusinessObjective();
    const [updateProfile] = useMutation(UPDATE_PROFILE);
    const [createProfile] = useMutation(CREATE_PROFILE);
    const associateSystems = useAssociateSystems();
    const associateRules = useAssociateRules();

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
                data: { createProfile: { profile: { id } } },
                error
            } = await createProfile({ variables: { input: policyInput } });

            if (error) { throw error; }

            dispatchProgress();
            policy = { id };
        } else {
            policyInput.id = policy.id;

            let { error } = await updateProfile({ variables: { input: policyInput } });
            if (error) { throw error; }

            dispatchProgress();
        }

        const { policy: { profiles } } = await associateSystems(policy, updatedPolicy.hosts);
        dispatchProgress();

        for (const profileSelectedRuleRefIds of selectedRuleRefIds) {
            await associateRules(profileSelectedRuleRefIds, profiles);
            dispatchProgress();
        }
    };
};

export default usePolicy;
