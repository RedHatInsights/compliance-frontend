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

export const applyTransformations = (
  item,
  rowsForItem,
  transformers,
  runningIndex,
) =>
  transformers.reduce(
    (currentRowsForItem, transformer) =>
      transformer
        ? transformer(item, currentRowsForItem, runningIndex)
        : currentRowsForItem,
    rowsForItem,
  );

/**
 * This function is used to assign the correct rowIndex for rows and for their details rows' parent prop
 *
 *  @returns {Function} A function to call whenever a row is added, it returns an integer that can optionally be used.
 *
 */
const indexRunner = () => {
  let index = 0;

  return () => {
    const currentIndex = index;
    index++;
    return currentIndex;
  };
};

export const buildRows = (items, columns, rowTransformers) => {
  const runningIndex = indexRunner();

  return items?.flatMap(({ rowColumns, ...item }) => {
    const rowIndex = runningIndex();
    const mainRow = itemRow({ ...item, rowIndex }, rowColumns || columns);

    return applyTransformations(item, [mainRow], rowTransformers, runningIndex);
  });
};

export const treeColumns = (columns, onCollapse, onSelect) => [
  {
    ...columns[0],
    cellTransforms: [
      ...(columns[0].cellTransforms || []),
      treeRow(
        (...args) => onCollapse?.(...args),
        onSelect && ((...args) => onSelect?.(...args)),
      ),
    ],
  },
  ...columns.slice(1),
];

export const collectLeaves = (tableTree, itemId) => {
  const pickBranch = (basket, branch, _idx, _arr, inBranchArg) => {
    const inBranch = inBranchArg || (itemId ? branch.itemId === itemId : true);
    const twigLeaves = branch?.twigs?.flatMap((twig) =>
      pickBranch([], twig, _idx, _arr, inBranch),
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
            ({ itemId }) => itemId,
          )
        : row.item.itemId;

      !row.props?.isChecked ? select(idsForSelect) : deselect(idsForSelect);
    })
  );
};

export const treeTableGroupColumns = [
  {
    key: 'title',
    renderFunc: (_u, _n, item) => <strong>{item.title}</strong>,
  },
];

export const groupItem = (item, isChecked, level, setSize) => ({
  ...item,
  rowColumns: treeTableGroupColumns,
  isTreeBranch: true,
  props: {
    isChecked,
    'aria-level': level,
    'aria-setsize':
      setSize || (item.twigs?.length || 0) + (item.leaves?.length || 0),
  },
});

export const isBranchChecked = (tableTree, item, isItemSelected) => {
  const leaves = collectLeaves(tableTree, item.itemId);
  const anySprouts = leaves?.length > 0;

  if (anySprouts && leaves.every(({ itemId }) => isItemSelected(itemId))) {
    return true;
  }

  if (anySprouts && leaves.some(({ itemId }) => isItemSelected(itemId))) {
    return null;
  }

  return false;
};
