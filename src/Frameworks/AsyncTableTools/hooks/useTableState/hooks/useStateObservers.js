import { useDeepCompareEffect } from 'use-deep-compare';

const useStateObservers = (
  observerNamespace,
  observers,
  observersInContext
) => {
  useDeepCompareEffect(() => {
    if (observers && observersInContext) {
      for (const [observedStatekey, observerFunction] of Object.entries(
        observers
      )) {
        observersInContext.current = {
          ...observersInContext?.current,
          [observedStatekey]: {
            ...(observersInContext?.current?.[observedStatekey] || {}),
            [observerNamespace]: observerFunction,
          },
        };
      }
    }
  }, [observers, observersInContext, observerNamespace]);
};

export default useStateObservers;
