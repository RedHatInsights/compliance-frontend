import { useEffect, useContext } from 'react';
import { TableContext } from '../constants';

const useContextOrInternalStateAndRefs = () => {
  const {
    state: contextState,
    observers: contextObservers,
    serialisers: contextSerialisers,
  } = useContext(TableContext);

  useEffect(() => {
    if (!contextState) {
      console.warn(
        '%cNo context provided for useTableState.\n' +
          'Using internal state and refs.\n' +
          'Make sure a TableStateProvider is available!',
        'background: red; color: white; font-weight: bold;'
      );
    }
  }, [contextState]);

  return {
    state: contextState,
    observers: contextObservers,
    serialisers: contextSerialisers,
  };
};

export default useContextOrInternalStateAndRefs;
