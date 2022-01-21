import React, { useState } from 'react';

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
  const enableExpanbale = !!options.detailsComponent;
  const [openItems, setOpenItems] = useState([]);
  const onCollapse = (_event, _index, _isOpen, row) => {
    if (openItems.includes(row.itemId)) {
      setOpenItems(openItems.filter((itemId) => itemId !== row.itemId));
    } else {
      setOpenItems([...openItems, row.itemId]);
    }
  };

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
      }
    : {};
};

export default useExpandable;
