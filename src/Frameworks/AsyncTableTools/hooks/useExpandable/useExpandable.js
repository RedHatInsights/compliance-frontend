import { useCallback, useEffect } from 'react';
import useSelectionManager from '../useSelectionManager';
import useTableState from '../useTableState';
import { itemDetailsRow } from './helpers';

/**
 *  @typedef {object | undefined} useExpandableReturn
 *
 *  @property {Function} [openItem]   "Transformer" function to be passed to the {@link rowsBuilder}
 *  @property {object}   [tableProps] Object containing Patternfly (deprecated) Table props
 *
 */

/**
 * Provides props for a Patternfly table to manage expandable items/rows.
 *
 *  @param   {object}              [options]                  AsyncTableTools options
 *  @param   {object}              [options.detailsComponent] A component that should be rendered as a details row
 *
 *  @returns {useExpandableReturn}                            An object of props meant to be used in the {@link AsyncTableToolsTable}
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useExpandable = (options) => {
  const enableExpandingRow = !!options?.detailsComponent || !!options.treeTable;
  const { selection: openItems, toggle } = useSelectionManager([]);
  // TODO If the selection manager is based on `useTableState`, observes can be used to reset open items
  const [, setOpenItemsState] = useTableState('open-items');

  const onCollapse = (_event, _index, _isOpen, { itemId }) => {
    toggle(itemId);
  };

  const openItem = useCallback(
    (row, _selectedIds, index) => {
      const isOpen = (openItems || []).includes(row.itemId);

      return isOpen
        ? [
            {
              ...row,
              isOpen,
            },
            itemDetailsRow(row, index, options),
          ]
        : [{ ...row, isOpen }];
    },
    [openItems, options]
  );

  // TODO This is hackish. We should rather have a selection manager based on a table state
  useEffect(() => {
    setOpenItemsState(openItems || []);
  }, [openItems, setOpenItemsState]);

  return enableExpandingRow
    ? {
        openItems,
        openItem,
        tableProps: {
          onCollapse,
        },
        tableView: {
          onCollapse,
          openItems,
        },
      }
    : {};
};

export default useExpandable;
