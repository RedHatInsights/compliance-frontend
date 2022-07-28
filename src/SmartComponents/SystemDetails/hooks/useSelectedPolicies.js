import { useState } from 'react';

const useSelectedPolicies = (policies) => {
  const [selectedPolicies, setSelectedPolicies] = useState();

  const setOrUnsetPolicy = (policy) => {
    if (!policy) {
      return;
    }
    const policyIncluded = selectedPolicies?.find(
      (policyId) => policy?.id === policyId
    );
    if (policyIncluded) {
      const newSelection = selectedPolicies?.filter(
        (policyId) => policy.id !== policyId
      );
      setSelectedPolicies(newSelection.length > 0 ? newSelection : undefined);
    } else {
      setSelectedPolicies([...(selectedPolicies || []), policy?.id]);
    }
  };

  const onDeleteFilter = (chips, clearAll) => {
    const chipNames = chips
      .find((chips) => chips.category === 'Policy')
      ?.chips.map((chip) => chip.name);
    const policyId = policies.find(({ name }) => chipNames?.includes(name))?.id;

    if (policyId) {
      !clearAll
        ? setOrUnsetPolicy(
            policyId
              ? {
                  id: policyId,
                }
              : {}
          )
        : setSelectedPolicies(undefined);
    }
  };

  return {
    selectedPolicies,
    onDeleteFilter,
    setOrUnsetPolicy,
  };
};

export default useSelectedPolicies;
