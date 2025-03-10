import { useCallback, useState } from 'react';
import useSelectionManager from '../useSelectionManager';
import {
  checkCurrentPageSelected,
  checkboxState,
  compileTitle,
  selectOrUnselect,
} from './helpers';
import useCallbacksCallback from '@/Frameworks/AsyncTableTools/hooks/useTableState/hooks/useCallbacksCallback';

/**
 *  @typedef {object} useBulkSelectReturn
 *
 *  @property {Function} [markRowSelected] "Transformer" function to be passed to the rowsBuilder
 *  @property {object}   [toolbarProps]    Object containing PrimaryToolbar props
 *  @property {object}   [tableProps]      Object containing Patternfly (v4) Table props
 *
 */

/**
 * Provides properties for a Pattternfly (based) Table and Toolbar component to implement bulk selection
 *
 *  @param   {object}              [options]                AsyncTableTools options
 *  @param   {number}              [options.total]          Number to show as total count
 *  @param   {Function}            [options.onSelect]       function to call when a selection is made
 *  @param   {Array}               [options.preselected]    Array of itemIds selected when initialising
 *  @param   {Function}            [options.itemIdsInTable] Function to call to retrieve IDs when "Select All" is chosen
 *  @param   {Array}               [options.itemIdsOnPage]  Array of item ids visible on the page
 *  @param   {string}              [options.identifier]     Property of the items that should be used as ID to select them
 *
 *  @returns {useBulkSelectReturn}                          Functions and props to use for setting up bulk selection
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useBulkSelect = ({
  total = 0,
  onSelect,
  preselected,
  itemIdsInTable,
  itemIdsOnPage,
  identifier = 'itemId',
}) => {
  const [loading, setLoading] = useState(false);
  const enableBulkSelect = !!onSelect;
  const {
    selection: selectedIds,
    set,
    select,
    deselect,
    clear,
    reset,
  } = useSelectionManager(preselected, {}, onSelect);
  const selectedIdsTotal = (selectedIds || []).length;
  const paginatedTotal = itemIdsOnPage?.length || total;
  const allSelected = selectedIdsTotal === total;
  const noneSelected = selectedIdsTotal === 0;
  const currentPageSelected = checkCurrentPageSelected(
    itemIdsOnPage,
    selectedIds
  );

  // TODO this is not totally wrong, but when the tree view is active there is currently no total, which causes the selection to be disabled there.
  // The bug may not even be fixed here, but in the tables that use selection and the tree view. They will need to provide an appropriate total still
  const isDisabled = total === 0;
  const checked = checkboxState(selectedIdsTotal, total);

  const title = compileTitle(selectedIdsTotal, loading);

  const isItemSelected = useCallback(
    (itemId) => selectedIds.includes(itemId),
    [selectedIds]
  );

  const selectOne = useCallback(
    (_, _selected, _key, { item }) => {
      return isItemSelected(item.itemId)
        ? deselect(item[identifier])
        : select(item[identifier]);
    },
    [isItemSelected, select, deselect, identifier]
  );
  const selectPage = useCallback(
    () =>
      !currentPageSelected ? select(itemIdsOnPage) : deselect(itemIdsOnPage),
    [select, deselect, itemIdsOnPage, currentPageSelected]
  );

  const resetSelection = useCallback(() => {
    reset();
  }, [reset]);

  useCallbacksCallback('resetSelection', resetSelection);

  const selectAll = async () => {
    setLoading(true);
    if (allSelected) {
      clear();
    } else {
      set(await itemIdsInTable());
    }
    setLoading(false);
  };

  const markRowSelected = useCallback(
    (item, rowsForItem, _runningIndex, isTreeTable) => {
      const firstRow = rowsForItem[0];
      const remainingRows = rowsForItem.slice(1);

      return [
        {
          ...firstRow,
          ...(!isTreeTable
            ? { selected: selectedIds.includes(item.itemId) }
            : {}),
          props: {
            ...firstRow.props,
            ...(isTreeTable && !item.isTreeBranch
              ? { isChecked: selectedIds.includes(item.itemId) }
              : {}),
          },
        },
        ...remainingRows,
      ];
    },
    [selectedIds]
  );

  return {
    tableView: {
      enableBulkSelect,
      markRowSelected,
      isItemSelected,
      select,
      deselect,
    },
    ...(enableBulkSelect
      ? {
          tableProps: {
            onSelect: total > 0 ? selectOne : undefined,
            canSelectAll: false,
          },
          toolbarProps: {
            bulkSelect: {
              toggleProps: { children: [title] },
              isDisabled,
              items: [
                {
                  title: 'Select none',
                  onClick: clear,
                  props: {
                    isDisabled: noneSelected,
                  },
                },
                ...(itemIdsOnPage
                  ? [
                      {
                        title: `${selectOrUnselect(
                          currentPageSelected
                        )} page (${paginatedTotal} items)`,
                        onClick: selectPage,
                      },
                    ]
                  : []),
                ...(itemIdsInTable
                  ? [
                      {
                        title: `${selectOrUnselect(
                          allSelected
                        )} all (${total} items)`,
                        onClick: selectAll,
                      },
                    ]
                  : []),
              ],
              checked,
              onSelect: !isDisabled ? selectPage : undefined,
            },
          },
        }
      : {}),
  };
};

export default useBulkSelect;
