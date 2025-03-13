import { useEffect, useContext } from 'react';
import { TableContext } from '../constants';

const useContextOrInternalStateAndRefs = () => {
  const context = useContext(TableContext);
  const {
    state: contextState,
    observers: contextObservers,
    serialisers: contextSerialisers,
    callbacks: contextCallbacks,
  } = context || {};

  useEffect(() => {
    if (!context) {
      console.warn(
        '%cNo context provided for useTableState.\n' +
          'Using internal state and refs.\n' +
          'Make sure a TableStateProvider is available!',
        'background: red; color: white; font-weight: bold;'
      );
    }
  }, [context]);

  return {
    state: contextState,
    observers: contextObservers,
    serialisers: contextSerialisers,
    callbacks: contextCallbacks,
  };
};

export default useContextOrInternalStateAndRefs;
