import React from 'react';

const detailsRowForRule = (item, DetailsComponent, colSpan, runningIndex) => ({
  parent: runningIndex() - 1,
  props: {
    ...item.props,
    'aria-setsize': 0,
  },
  cells: [
    {
      title: <DetailsComponent item={item} key={'item-' + item.rowId} />,
      props: {
        ...(colSpan ? { colSpan } : {}),
        // TODO This removes the checkbox, however this should maybe be fixed differently
        className: 'compliance-rule-details',
      },
    },
  ],
});

export const itemDetailsRow = (item, options, runningIndex) =>
  typeof options?.detailsComponent !== 'undefined' &&
  detailsRowForRule(
    item,
    options.detailsComponent,
    options.columns?.length,
    runningIndex
  );

const expandTreeTableRow = (firstRow, isOpen) => ({
  ...firstRow,
  props: {
    ...(firstRow.props || {}),
    isExpanded: isOpen,
  },
});

const expandTableRow = (firstRow, isOpen) => ({
  ...firstRow,
  isOpen,
});

export const addExpandProp = (firstRow, isTreeTable, isOpen) =>
  isTreeTable
    ? expandTreeTableRow(firstRow, isOpen)
    : expandTableRow(firstRow, isOpen);
