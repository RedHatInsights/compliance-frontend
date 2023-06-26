import React, { useCallback, useMemo, useState } from 'react';
import { findParentsForItemInTree } from './rowBuilderHelpers';

const calculateColSpan = (columns, options) => {
  let colSpan = columns.length + 1;
  if (options.selectable || options.hasRadioSelect) {
    colSpan++;
  }
  return colSpan;
};

const childRowForRule = (item, idx, DetailsComponent, colSpan) => ({
  parent: idx * 2,
  fullWidth: true,
  cells: [
    {
      title: <DetailsComponent item={item} key={'item-' + item.rowId} />,
      props: { colSpan },
    },
  ],
});

const itemDetailsRow = (item, idx, options, columns) =>
  typeof options?.detailsComponent !== 'undefined' &&
  childRowForRule(
    item,
    idx,
    options.detailsComponent,
    calculateColSpan(columns, options)
  );

const useExpandable = (options) => {
  const enableExpanbale = !!options.detailsComponent && !options.showTreeTable;
  const findParentsForItem = useMemo(
    () => findParentsForItemInTree(options.tableTree),
    [options.tableTreee]
  );

  const [openItems, setOpenItems] = useState([]);
  const onCollapse = useCallback(
    (_event, _index, _isOpen, row) => {
      const parentItemIds = findParentsForItem(row.itemId);

      if (openItems.includes(row.itemId)) {
        setOpenItems((currentOpenItems) =>
          currentOpenItems.filter((itemId) => itemId !== row.itemId)
        );
      } else {
        setOpenItems((currentOpenItems) => [
          ...currentOpenItems,
          ...parentItemIds,
          row.itemId,
        ]);
      }
    },
    [openItems, setOpenItems]
  );

  const openItem = (row, item, columns, rowIndex) => {
    const isOpen = openItems.includes(item.itemId);
    const newRow = {
      ...row,
      isOpen,
    };
    const expandableRow = itemDetailsRow(item, rowIndex, options, columns);

    return [newRow, expandableRow];
  };

  return enableExpanbale
    ? {
        transformer: openItem,
        tableProps: {
          onCollapse,
        },
        openItems,
      }
    : {
        tableProps: {
          onCollapse,
        },
        openItems,
      };
};

export default useExpandable;
