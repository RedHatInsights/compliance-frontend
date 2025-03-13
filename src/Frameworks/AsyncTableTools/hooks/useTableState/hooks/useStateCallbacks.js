import useContextOrInternalStateAndRefs from '@/Frameworks/AsyncTableTools/hooks/useTableState/hooks/useContextOrInternalStateAndRefs';

const useStateCallbacks = () => {
  const { callbacks } = useContextOrInternalStateAndRefs();
  return callbacks;
};

export default useStateCallbacks;
