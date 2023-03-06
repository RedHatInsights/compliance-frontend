import { useCallback, useEffect, useState } from 'react';
import { checkForNonDefaultValues } from './helpers';

import usePolicyMutation from '@/Mutations/hooks/usePolicyMutation';
import { dispatchNotification } from 'Utilities/Dispatcher';

export const useResetValues = (
  policyId,
  values,
  valueDefinitions,
  callback = () => {
    return;
  }
) => {
  const updatePolicy = usePolicyMutation();
  const [nonDefaultValues, setNonDefaultValues] = useState(false);

  const resetValues = useCallback(async () => {
    updatePolicy(policyId, {
      values: Object.fromEntries(
        Object.entries(values).map(([valueId]) => {
          const valueDefinition = valueDefinitions.find(
            (valueDefinition) =>
              valueDefinition.refId === valueId ||
              valueDefinition.id === valueId
          );
          return [valueDefinition.refId, valueDefinition.defaultValue];
        })
      ),
    })
      .then(() => {
        dispatchNotification({
          variant: 'success',
          title: 'Rule values reset to default',
          autoDismiss: true,
        });
      })
      .catch((error) => {
        dispatchNotification({
          variant: 'danger',
          title: 'Error resetting rule value',
          description: error.message,
        });
      })
      .finally(() => callback());
  }, [policyId, valueDefinitions, values, callback]);

  useEffect(
    () =>
      setNonDefaultValues(checkForNonDefaultValues(values, valueDefinitions)),
    [valueDefinitions, values]
  );

  return { resetValues, nonDefaultValues };
};
