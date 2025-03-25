import useStateCallbacks from '@/Frameworks/AsyncTableTools/hooks/useTableState/hooks/useStateCallbacks';
import { useEffect } from 'react';

const useCallbacksCallback = (namespace, fn) => {
  const callbacks = useStateCallbacks();
  useEffect(() => {
    callbacks.current[namespace] = fn;
  }, [callbacks, namespace, fn]);
};

export default useCallbacksCallback;
