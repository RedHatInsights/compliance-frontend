import { useCallback, useMemo } from 'react';
import { TABLE_STATE_NAMESPACE as FILTERS_TABLE_NAMESPACE } from '../../useFilterConfig/constants';
import { TABLE_STATE_NAMESPACE as SORT_TABLE_NAMESPACE } from '../../useTableSort/constants';
import { TABLE_STATE_NAMESPACE as VIEW_TABLE_NAMESPACE } from '../../useTableView/constants';
import useTableState from '../../useTableState';

import { TABLE_STATE_NAMESPACE } from '../constants';

const usePaginationState = (options) => {
  const { perPage = 10, serialisers } = options;
  const defaultState = useMemo(() => {
    return {
      perPage,
      page: 1,
    };
  }, [perPage]);
  const resetPage = useCallback(
    (currentState) => {
      return {
        ...currentState,
        state: {
          ...(currentState?.state || defaultState),
          page: 1,
        },
      };
    },
    [defaultState]
  );

  const stateObservers = useMemo(
    () => ({
      [VIEW_TABLE_NAMESPACE]: (currentState, _previousView, nextView) => ({
        ...(currentState || { state: defaultState }),
        isDisabled: (nextView || _previousView) !== 'rows',
      }),
      [SORT_TABLE_NAMESPACE]: resetPage,
      [FILTERS_TABLE_NAMESPACE]: resetPage,
    }),
    [resetPage, defaultState]
  );
  const [paginationState, setPaginationState] = useTableState(
    TABLE_STATE_NAMESPACE,
    {
      state: defaultState,
      isDisabled: false,
    },
    {
      ...(serialisers?.pagination
        ? {
            serialiser: (currentState) =>
              serialisers?.pagination(currentState?.state),
          }
        : {}),
      observers: stateObservers,
    }
  );

  return [paginationState, setPaginationState];
};

export default usePaginationState;
