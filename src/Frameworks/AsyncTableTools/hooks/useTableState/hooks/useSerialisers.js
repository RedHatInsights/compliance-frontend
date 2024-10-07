import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';

const useSerialisers = (
  serialiserNamespace,
  serialiser,
  serialiserInContext
) => {
  useDeepCompareEffectNoCheck(() => {
    if (serialiser) {
      serialiserInContext.current = {
        ...serialiserInContext.current,
        [serialiserNamespace]: serialiser,
      };
    }
  }, [
    serialiserInContext,
    serialiserNamespace,
    typeof serialiser !== 'undefined',
  ]);
};

export default useSerialisers;
