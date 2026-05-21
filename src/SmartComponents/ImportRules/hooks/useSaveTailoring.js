import { useCallback } from 'react';
import useCreateTailoring from 'Utilities/hooks/api/useCreateTailoring';
import useAssignRules from 'Utilities/hooks/api/useAssignRules';
import useComplianceNavigate from '@/Utilities/hooks/useComplianceNavigate';

const useSaveTailoring = ({
  policyId,
  osMinorVersion: os_minor_version,
  selection,
}) => {
  const navigate = useComplianceNavigate();

  const { query: assignRules } = useAssignRules({
    params: { policyId },
    skip: true,
  });
  const { queue: createTailorings } = useCreateTailoring({
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

    navigate(`/scappolicies/${policyId}#rules`);
  }, [
    policyId,
    createTailorings,
    assignRules,
    os_minor_version,
    selection,
    navigate,
  ]);

  return onSave;
};

export default useSaveTailoring;
