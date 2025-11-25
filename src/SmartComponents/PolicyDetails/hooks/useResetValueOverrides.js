import { useCallback } from 'react';
import useUpdateTailoring from 'Utilities/hooks/api/useUpdateTailoring';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';

const useResetValueOverrides = (policyId, refetch) => {
  const { fetch: updateTailoring } = useUpdateTailoring({ skip: true });
  const { fetch: fetchTailorings } = useTailorings({ skip: true });
  const addNotification = useAddNotification();

  const resetValueOverrides = useCallback(
    async (osMinorVersion, ruleValues, valueDefinitions) => {
      try {
        const tailoringsResponse = await fetchTailorings({
          policyId,
          filter: `os_minor_version=${osMinorVersion}`,
        });
        const tailoring = tailoringsResponse.data[0];
        const tailoringId = tailoring?.id;
        const valueOverrides = tailoring?.value_overrides;

        const updatedValueOverrides = Object.keys(valueOverrides).reduce(
          (acc, key) => {
            if (ruleValues[key] !== undefined) {
              const valueDefinition = valueDefinitions.find(
                (valueDef) => valueDef.id === key,
              );
              acc[key] = valueDefinition?.default_value ?? valueOverrides[key];
            } else {
              acc[key] = valueOverrides[key];
            }
            return acc;
          },
          {},
        );

        await updateTailoring({
          policyId: policyId,
          tailoringId: tailoringId,
          valuesUpdate: { value_overrides: updatedValueOverrides },
        });

        addNotification({
          variant: 'success',
          title: 'Rule values reset to default',
          autoDismiss: true,
        });

        refetch?.();
      } catch (error) {
        console.error(error);
        addNotification({
          variant: 'danger',
          title: 'Error resetting rule value',
          description: error.message,
        });
      }
    },
    [policyId, fetchTailorings, updateTailoring, addNotification, refetch],
  );

  return resetValueOverrides;
};

export default useResetValueOverrides;
