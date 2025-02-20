import React from 'react';

const detailsRowForRule = (item, idx, DetailsComponent, colSpan) => ({
  parent: idx,
  props: {
    ...item.props,
    'aria-setsize': 0,
    isDetailsRow: true,
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

export const itemDetailsRow = (item, idx, options) =>
  typeof options?.detailsComponent !== 'undefined' &&
  detailsRowForRule(
    item,
    idx,
    options.detailsComponent,
    options.columns?.length
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
