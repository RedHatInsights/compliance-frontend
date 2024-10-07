import React, { useMemo } from 'react';
import TableViewToggle from '../../components/TableViewToggle';
import useViews from './hooks/useViews';
import useViewState from './hooks/useViewState';

/**
 * A hook that manages "views" for a Patternfly (v4) Table component, like a simple "row" view or a "tree" view
 *
 *  @param   {Array}   items                      An array of items to render
 *  @param   {Array}   columns                    An array of columns to render items with
 *  @param   {object}  [options]                  AsyncTableTools options
 *  @param   {object}  [options.tableTree]
 *  @param   {boolean} [options.showViewToggle]
 *  @param   {string}  [options.defaultTableView]
 *
 *  @returns {object}                             TODO
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useTableView = (items, columns, options = {}) => {
  const { showViewToggle } = options;
  const { setTableView, tableView } = useViewState(options);
  const { tableProps, toolbarProps, choosableViews } = useViews(
    tableView,
    items,
    columns,
    options
  );

  const enableToggle = useMemo(
    () =>
      typeof showViewToggle === 'boolean'
        ? showViewToggle
        : Object.keys(choosableViews).length > 1,
    [choosableViews, showViewToggle]
  );

  return {
    ...(tableProps ? { tableProps } : {}),
    ...(toolbarProps ? { toolbarProps } : {}),
    ...(enableToggle
      ? {
          TableViewToggle: function Toggle() {
            return (
              <TableViewToggle
                views={choosableViews}
                onToggle={setTableView}
                currentTableView={tableView}
              />
            );
          },
        }
      : {}),
  };
};

export default useTableView;
