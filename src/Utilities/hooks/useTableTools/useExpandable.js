import React, { useState } from 'react';

const childRowForRule = (item, idx, DetailsComponent) => ({
  parent: idx * 2,
  cells: [
    { title: <DetailsComponent rule={item} key={'item-' + item.rowId} /> },
  ],
});

const itemDetailsRow = (item, idx, options) =>
  typeof options?.detailsComponent !== 'undefined' &&
  childRowForRule(item, idx, options.detailsComponent);

const useExpandable = (options) => {
  const enableExpanbale = !!options.detailsComponent;
  const [openItems, setOpenItems] = useState([]);
  const onCollapse = (_event, _index, _isOpen, row) => {
    if (openItems.includes(row.itemId)) {
      setOpenItems(openItems.filter((itemId) => itemId !== row.itemId));
    } else {
      setOpenItems([...openItems, row.itemId]);
    }
  };

  const openItem = (row, item, _columns, rowIndex) => {
    const isOpen = openItems.includes(item.itemId);
    const newRow = {
      ...row,
      isOpen,
    };
    const expandableRow = itemDetailsRow(item, rowIndex, options);

    return [newRow, expandableRow];
  };

  return enableExpanbale
    ? {
        transformer: openItem,
        tableProps: {
          onCollapse,
        },
      }
    : {};
};

export default useExpandable;
