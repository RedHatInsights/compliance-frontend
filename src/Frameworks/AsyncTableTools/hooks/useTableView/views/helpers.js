import React from 'react';
import { treeRow } from '@patternfly/react-table';

export const columnProp = (column) =>
  column.key || column.original?.toLowerCase() || column.title?.toLowerCase();

// TODO Make renderFunc obsolete
// We carried over this pattern to keep compatibility with old columns
// Only having to pass a "component" prop for columns and pass the "item" attributes as props would be nicer
export const itemRow = ({ rowProps, props = {}, ...item }, columns) => ({
  props,
  ...rowProps,
  cells: columns.map((column) => ({
    title: column.renderFunc
      ? column.renderFunc(undefined, undefined, item)
      : item[columnProp(column)],
  })),
  item,
});

export const applyTransformations = (item, rowsForItem, transformers, index) =>
  transformers.reduce(
    (currentRowsForItem, transformer) =>
      transformer
        ? transformer(item, currentRowsForItem, index)
        : currentRowsForItem,
    rowsForItem
  );

export const buildRows = (items, columns, rowTransformers) =>
  items?.flatMap((item, runningIndex) =>
    applyTransformations(
      item,
      [itemRow(item, columns)],
      rowTransformers,
      runningIndex
    )
  );

export const treeColumns = (columns, onCollapse, onSelect) => [
  {
    ...columns[0],
    cellTransforms: [
      ...(columns[0].cellTransforms || []),
      treeRow(
        (...args) => onCollapse?.(...args),
        onSelect && ((...args) => onSelect?.(...args))
      ),
    ],
  },
  ...columns.slice(1),
];

export const collectLeaves = (tableTree, itemId) => {
  const pickBranch = (basket, branch, _idx, _arr, inBranchArg) => {
    const inBranch = inBranchArg || (itemId ? branch.itemId === itemId : true);
    const twigLeaves = branch?.twigs?.flatMap((twig) =>
      pickBranch([], twig, _idx, _arr, inBranch)
    );

    return [
      ...basket,
      ...(twigLeaves || []),
      ...(inBranch ? branch.leaves || [] : []),
      ...(inBranch ? (branch.leave ? [branch.leave] : []) : []),
    ];
  };

  return tableTree.reduce(pickBranch, []);
};

export const getOnTreeSelect = (options) => {
  const { select, deselect } = options.bulkSelect || {};

  return (
    options.bulkSelect &&
    ((...args) => {
      const row = args[4];
      const idsForSelect = row.item.isTreeBranch
        ? collectLeaves(options.tableTree, row.item.itemId).map(
            ({ itemId }) => itemId
          )
        : row.item.itemId;
      console.log('idsForSelect', idsForSelect, row);
      !row.props?.isChecked ? select(idsForSelect) : deselect(idsForSelect);
    })
  );
};

export const groupItem = (item, selectable, isChecked, level, setSize) => ({
  ...item,
  isTreeBranch: true,
  props: {
    ...(selectable
      ? {
          isChecked: isChecked(),
        }
      : {}),
    'aria-level': level,
    'aria-setsize':
      setSize || (item.twigs?.length || 0) + (item.leaves?.length || 0),
  },
});

export const treeTableGroupColumns = [
  {
    key: 'title',
    renderFunc: (_u, _n, item) => <strong>{item.title}</strong>,
  },
];
