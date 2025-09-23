import { useCallback } from 'react';
import useCreateTailoring from 'Utilities/hooks/api/useCreateTailoring';
import useAssignRules from 'Utilities/hooks/api/useAssignRules';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';

const useSaveTailoring = ({
  policyId,
  osMinorVersion: os_minor_version,
  selection,
  tailorings,
}) => {
  const navigate = useInsightsNavigate();
  const addNotification = useAddNotification();

  const { fetch: assignRules } = useAssignRules({
    params: { policyId },
    skip: true,
  });
  const { fetch: createTailorings } = useCreateTailoring({
    params: { policyId },
  });

  const onSave = useCallback(async () => {
    try {
      let tailoring = tailorings?.find(
        ({ os_minor_version: version }) => version === Number(os_minor_version),
      );
      if (!tailoring) {
        ({ data: tailoring } = await createTailorings({
          tailoringCreate: { os_minor_version },
        }));
      }

      await assignRules({
        tailoringId: tailoring.id,
        // TODO Doublecheck what happens when submitting refIds that have been removed from the target profile
        assignRulesRequest: { ids: selection },
      });

      addNotification({
        variant: 'success',
        title: `Migrated rules for minor version ${os_minor_version}`,
      });
    } catch (e) {
      addNotification({
        variant: 'danger',
        title: `Error migrating rules for policy minor version ${os_minor_version}`,
        description: e?.message,
      });
    }

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
