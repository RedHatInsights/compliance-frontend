import { useCallback, useRef } from 'react';
import { TABLE_STATE_NAMESPACE as FILTERS_TABLE_STATE_NAMESPACE } from '../../useFilterConfig/constants';
import useTableState from '../../useTableState';
import { DEFAULT_TABLE_VIEW, TABLE_STATE_NAMESPACE } from '../constants';

const useViewState = (options) => {
  const { defaultTableView = DEFAULT_TABLE_VIEW } = options;
  const internalTableView = useRef(defaultTableView);
  // TODO Possible turn this into a table feature
  const filtersObserver = useCallback(
    (_currentTableViewState, previousFilters, nextFilters) => {
      const newView =
        nextFilters?.name?.[0] !== previousFilters?.name?.[0]
          ? 'rows'
          : internalTableView.current;

      internalTableView.current = newView;
      return newView;
    },
    []
  );
  const itemObserver = useCallback(
    (_currentTableViewState, _previousItems, items) => {
      let newView;
      if (
        typeof items === 'undefined' &&
        internalTableView.current !== 'tree'
      ) {
        newView = 'loading';
      } else if (items?.length === 0 && internalTableView.current !== 'tree') {
        newView = 'empty';
      } else if (items?.length > 0) {
        newView = internalTableView.current;
      }

      return newView;
    },
    []
  );
  const [tableView, setTableViewState] = useTableState(
    TABLE_STATE_NAMESPACE,
    defaultTableView,
    {
      observers: {
        [FILTERS_TABLE_STATE_NAMESPACE]: filtersObserver,
        items: itemObserver,
      },
    }
  );
  const setTableView = useCallback(
    (view) => {
      internalTableView.current = view;
      setTableViewState(view);
    },
    [setTableViewState]
  );

  return {
    setTableView,
    tableView,
  };
};

export default useViewState;
