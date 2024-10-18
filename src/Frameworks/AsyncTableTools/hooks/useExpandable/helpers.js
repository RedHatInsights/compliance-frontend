import React from 'react';

const childRowForRule = (item, idx, DetailsComponent) => ({
  parent: idx,
  fullWidth: true,
  cells: [
    { title: <DetailsComponent item={item} key={'item-' + item.rowId} /> },
  ],
});

export const itemDetailsRow = (item, idx, options) =>
  typeof options?.detailsComponent !== 'undefined' &&
  childRowForRule(item, idx, options.detailsComponent);
