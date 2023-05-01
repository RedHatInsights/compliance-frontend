import useCreateBusinessObjective from './useCreateBusinessObjective';
import usePolicyMutation from './usePolicyMutation';
import useAssociateSystems from './useAssociateSystems';
import useAssociateRules from './useAssociateRules';

const usePolicy = () => {
  const createBusinessObjective = useCreateBusinessObjective();
  const policyMutation = usePolicyMutation();
  const associateSystems = useAssociateSystems();
  const associateRules = useAssociateRules();

  return async (
    policy,
    { values = {}, selectedRuleRefIds, ...updatedPolicy },
    onProgress
  ) => {
    const expectedUpdates =
      3 + Object.keys(values).length + (selectedRuleRefIds || []).length;
    let progress = 0;
    const dispatchProgress = () => {
      if (onProgress) {
        onProgress(++progress / expectedUpdates);
      }
    };

    const businessObjectiveId = await createBusinessObjective(
      policy,
      updatedPolicy?.businessObjective
    );
    dispatchProgress();

    const mutatedPolicy = await policyMutation(
      policy?.id,
      { ...updatedPolicy, selectedRuleRefIds },
      businessObjectiveId
    );
    dispatchProgress();

    if (!policy) {
      policy = mutatedPolicy;
    }

    const {
      policy: { profiles },
    } = await associateSystems(policy, updatedPolicy.hosts);
    dispatchProgress();

    for (const profileSelectedRuleRefIds of selectedRuleRefIds || []) {
      await associateRules(profileSelectedRuleRefIds, profiles);
      dispatchProgress();
    }

    for (const [profileId, profileValues] of Object.entries(values)) {
      const realProfile = profiles.find(
        ({ id, parentProfileId }) =>
          id === profileId || parentProfileId === profileId
      );
      const convertedValues = Object.fromEntries(
        Object.entries(profileValues).map(([valueId, valueValue]) => {
          const refId = realProfile?.benchmark.valueDefinitions.find(
            ({ id }) => id === valueId
          )?.refId;

          return [refId || valueId, valueValue];
        })
      );

      await policyMutation(realProfile.id, { values: convertedValues });
      dispatchProgress();
    }

    return mutatedPolicy;
  };
};

export default usePolicy;
