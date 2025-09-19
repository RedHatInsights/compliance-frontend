import { useCallback } from 'react';
import useCreateTailoring from 'Utilities/hooks/api/useCreateTailoring';
import useAssignRules from 'Utilities/hooks/api/useAssignRules';

const useSaveTailoring = ({
  policyId,
  osMinorVersion: os_minor_version,
  selection,
}) => {
  const { fetch: assignRules } = useAssignRules({
    params: { policyId },
    skip: true,
  });
  const { fetch: createTailorings } = useCreateTailoring({
    params: { policyId },
  });

  const onSave = useCallback(async () => {
    const tailoring = await createTailorings({
      tailoringCreate: { os_minor_version },
    });

    await assignRules({
      tailoringId: tailoring.id,
      // TODO Doublecheck what happens when submitting refIds that have been removed from the target profile
      assignRulesRequest: { ids: selection },
    });
  }, [createTailorings, assignRules, os_minor_version, selection]);

  return onSave;
};

export default useSaveTailoring;
