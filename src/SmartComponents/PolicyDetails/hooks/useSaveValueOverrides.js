import { useCallback } from 'react';
import useUpdateTailoring from 'Utilities/hooks/api/useUpdateTailoring';

const useSaveValueOverrides = () => {
  const { fetch: submit } = useUpdateTailoring();
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
      const params = [policyId, tailoringId, undefined, tailoringData];

      return await submit(params, false);
    },
    [submit]
  );

  return saveValueOverrides;
};

export default useSaveValueOverrides;
