import useCreateBusinessObjective from './useCreateBusinessObjective';
import usePolicyMutation from './usePolicyMutation';
import useAssociateSystems from './useAssociateSystems';
import useAssociateRules from './useAssociateRules';

const usePolicy = () => {
    const createBusinessObjective = useCreateBusinessObjective();
    const policyMutation = usePolicyMutation();
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

        const mutatedPolicy = await policyMutation(policy?.id, updatedPolicy, businessObjectiveId);
        dispatchProgress();

        if (!policy) {
            policy = mutatedPolicy;
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
