import { useCallback } from 'react';
import useUpdateTailoring from 'Utilities/hooks/api/useUpdateTailoring';

const useSaveValueOverrides = () => {
  const { query: submit } = useUpdateTailoring();
  const saveValueOverrides = useCallback(
    async (policy, tailoring, valueDefintion, newValue) => {
      const { id: policyId } = policy;
      const { id: tailoringId, value_overrides } = tailoring;

      const tailoringData = {
        value_overrides: {
          ...value_overrides,
          [valueDefintion.id]: newValue,
        },
      };

      return await submit({
        policyId,
        tailoringId,
        valuesUpdate: tailoringData,
      });
    },
    [submit],
  );

  return saveValueOverrides;
};

export default useSaveValueOverrides;
