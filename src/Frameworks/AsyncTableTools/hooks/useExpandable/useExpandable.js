import { useCallback } from 'react';
import useSelectionManager from '../useSelectionManager';
import { itemDetailsRow } from './helpers';

/**
 *  @typedef {object} AsyncTableProps
 *  @property {object} toolbarProps Object containing PrimaryToolbar props
 *  @property {object} tableProps Object containing Patternfly (deprecated) Table props
 */

/**
 * Provides props for a Patternfly table to manage expandable items/rows.
 *  @param {object} [options] an oblect containing detailComponent to render on expand
 *  @returns {AsyncTableProps} An object of props meant to be used in the {@link AsyncTableToolsTable}
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 */

const useExpandable = (options) => {
  const enableExpandingRow = !!options?.detailsComponent;
  const { selection: openItems, toggle } = useSelectionManager([]);

  const onCollapse = (_event, _index, _isOpen, { itemId }) => toggle(itemId);

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
    [openItems]
  );

  return enableExpandingRow
    ? {
        openItem,
        openItems,
        tableProps: {
          onCollapse,
        },
      }
    : {};
};

export default useExpandable;
