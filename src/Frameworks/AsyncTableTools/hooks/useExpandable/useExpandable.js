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
  const [, setOpenItemsState] = useTableState('open-items');

  const { selection: openItems, toggle } = useSelectionManager([]);

  const onCollapse = (_event, _index, _isOpen, { itemId }) => {
    toggle(itemId);
  };

  const openItem = useCallback(
    (row, _selectedIds, index) => {
      const expandedRow = [
        {
          ...row,
          isOpen: (openItems || []).includes(row.itemId),
        },
        itemDetailsRow(row, index, options),
      ];

      return expandedRow;
    },
    [openItems, options]
  );

  useEffect(() => {
    setOpenItemsState(openItems);
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
