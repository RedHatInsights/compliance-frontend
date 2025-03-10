import { useDeepCompareEffect } from 'use-deep-compare';

const useCallbacks = (callbackNamespace, callback, callbackInContext) => {
  useDeepCompareEffect(() => {
    console.log('callback', callback);
    if (callback) {
      callbackInContext.current = {
        ...callbackInContext.current,
        [callbackNamespace]: callback,
      };
    }
  }, [callbackInContext, callbackNamespace, typeof callback !== 'undefined']);
};

export default useCallbacks;
