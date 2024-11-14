import { useCallback, useMemo } from 'react';
import { addSortableTransform, columnOffset } from './helpers';
import useTableState from '../useTableState';
import { TABLE_STATE_NAMESPACE } from './constants';

/**
 *  @typedef {object} useTableSortReturn
 *
 *  @property {object}   [tableProps]         Props for a Patternfly table
 *  @property {Function} [tableProps.onSort]  Callback function for column headers in a Patternfly table
 *  @property {Array}    [tableProps.cells]   Array containing columns for a Patternfly table with the sortable transform applied
 *  @property {object}   [tableProps.sortBy ] Object containing the current sortBy state
 *
 */

/**
 * Provides columns with the `sortable` transform mixed in for a Patternfly table.
 *
 *  @param   {Array}              columns                    Columns for a table, with a "sortable" prop
 *  @param   {object}             [options]                  AsyncTableTools options
 *  @param   {object}             [options.sortBy]           An initial sortBy state like `{index: 1, direction: 'desc'}`
 *  @param   {object}             [options.onSort]           A function to call after setting a new sort state.
 *  @param   {object}             [options.serialisers.sort] A function to provide a serialiser for the table state
 *
 *  @returns {useTableSortReturn}                            Props for a Patternfly table to integrate sorting
 *
 *  @example
 *
 * const columns = [{ title: 'Name', sortable: true }]
 * const tableSort = useTableSort(columns)
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useTableSort = (columns, options = {}) => {
  const { sortBy: initialSortBy, serialisers, onSort: onSortOption } = options;
  const serialiser = useCallback(
    (state) => options.serialisers.sort(state, columns),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(columns), JSON.stringify(options.serialisers)]
  );
  const stateOptions = useMemo(
    () => ({
      ...(serialisers?.sort
        ? {
            serialiser,
          }
        : {}),
    }),
    [serialisers, serialiser]
  );
  const [sortBy, setSortBy] = useTableState(
    TABLE_STATE_NAMESPACE,
    initialSortBy || {
      index: columnOffset(options),
      direction: 'asc',
    },
    stateOptions
  );

  const onSort = useCallback(
    (_, index, direction) => {
      setSortBy({
        index,
        direction,
      });
      onSortOption?.(index, direction);
    },
    [onSortOption, setSortBy]
  );

  return {
    tableProps: {
      onSort,
      sortBy: sortBy,
      cells: addSortableTransform(columns),
    },
  };
};

export default useTableSort;
