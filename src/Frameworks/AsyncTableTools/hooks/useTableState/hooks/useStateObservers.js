import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';
import useContextOrInternalStateAndRefs from './useContextOrInternalStateAndRefs';

const useStateObservers = (observerNamespace, observers) => {
  const { observers: observersInContext } = useContextOrInternalStateAndRefs();

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

  return observersInContext?.current?.[observerNamespace];
};

export default useStateObservers;
