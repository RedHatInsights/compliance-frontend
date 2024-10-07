import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';

const useStateObservers = (
  observerNamespace,
  observers,
  observersInContext
) => {
  useDeepCompareEffectNoCheck(() => {
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
