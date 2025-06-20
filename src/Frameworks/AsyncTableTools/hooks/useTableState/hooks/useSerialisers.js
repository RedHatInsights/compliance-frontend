import { useDeepCompareEffect } from 'use-deep-compare';

const useSerialisers = (
  serialiserNamespace,
  serialiser,
  serialiserInContext,
) => {
  useDeepCompareEffect(() => {
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
