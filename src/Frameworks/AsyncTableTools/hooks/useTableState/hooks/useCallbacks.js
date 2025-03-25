import { useDeepCompareEffect } from 'use-deep-compare';

const useCallbacks = (callbackNamespace, callback, callbackInContext) => {
  useDeepCompareEffect(() => {
    if (callback) {
      callbackInContext.current = {
        ...callbackInContext.current,
        [callbackNamespace]: callback,
      };
    }
  }, [callbackInContext, callbackNamespace, typeof callback !== 'undefined']);
};

export default useCallbacks;
