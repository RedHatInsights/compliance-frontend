import { useCallback } from 'react';
import useSelectionManager from '../useSelectionManager';
import useFetchBatched from '@redhat-cloud-services/frontend-components-utilities/useFetchBatched';
import {
  checkCurrentPageSelected,
  checkboxState,
  compileTitle,
  selectOrUnselect,
} from './helpers';

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
  const enableBulkSelect = !!onSelect;
  const {
    selection: selectedIds,
    set,
    select,
    deselect,
    clear,
  } = useSelectionManager(preselected);
  const selectedIdsTotal = (selectedIds || []).length;
  const paginatedTotal = itemIdsOnPage?.length || total;
  const allSelected = selectedIdsTotal === total;
  const noneSelected = selectedIdsTotal === 0;
  const currentPageSelected = checkCurrentPageSelected(
    itemIdsOnPage,
    selectedIds
  );

  const isDisabled = total === 0;
  const checked = checkboxState(selectedIdsTotal, total);

  const { isLoading, fetchBatched } = useFetchBatched();
  const title = compileTitle(selectedIdsTotal, isLoading);

  const selectOne = useCallback(
    (_, _selected, _key, row) =>
      row.selected ? deselect(row[identifier]) : select(row[identifier]),
    [select, deselect, identifier]
  );
  const selectPage = useCallback(
    () =>
      !currentPageSelected ? select(itemIdsOnPage) : deselect(itemIdsOnPage),
    [select, deselect, itemIdsOnPage, currentPageSelected]
  );

  const selectAll = async () => {
    if (allSelected) {
      clear();
    } else {
      set(await fetchBatched(itemIdsInTable, total));
    }
  };

  const markRowSelected = (row) => ({
    ...row,
    isSelected: selectedIds.includes(row.itemId),
  });

  return enableBulkSelect
    ? {
        markRowSelected,
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
    : {};
};

export default useBulkSelect;
