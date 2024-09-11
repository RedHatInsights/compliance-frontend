import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';
import useContextOrInternalStateAndRefs from './useContextOrInternalStateAndRefs';

const useSerialisers = (serialiserNamespace, serialiser) => {
  const { serialisers: serialiserInContext } =
    useContextOrInternalStateAndRefs();

  useDeepCompareEffectNoCheck(() => {
    if (serialiser) {
      serialiserInContext.current = {
        ...serialiserInContext.current,
        [serialiserNamespace]: serialiser,
      };
    }
  }, [serialiserInContext, serialiserNamespace, serialiser]);

  return serialiserInContext?.current?.[serialiserNamespace];
};

export default useSerialisers;
