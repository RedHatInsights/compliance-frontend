import React from 'react';
import { buildRows, treeTableGroupColumns, groupItem } from './helpers';

const buildTreeBranch = (
  item,
  items,
  columns,
  rowTransformer,
  idx,
  level = 1,
  setSize,
  selectable,
  expandOnFilter = false
) => {
  const nextLevel = level + 1;

  const leaves = (() => {
    const leafItems = item.leaves
      ?.map((leaf) => items?.find(({ itemId }) => itemId === leaf.itemId))
      .filter((v) => !!v)
      .map((item) => ({
        ...item,
        props: {
          ...item.props,
          'aria-level': nextLevel,
          'aria-setsize': 1,
        },
      }));

    const rows = buildRows(leafItems, columns, rowTransformer);

    return rows;
  })();

  const twigs = item.twigs
    ? item.twigs?.flatMap((twig) => {
        const tt = buildTreeBranch(
          twig,
          items,
          columns,
          rowTransformer,
          idx,
          nextLevel,
          (twig.twigs?.length || 0) + (twig.leaves?.length || 0),
          selectable,
          expandOnFilter
        );

        return tt;
      })
    : [];

  const isChecked = () => {
    const anySprouts = leaves.length > 0 || twigs.length > 0;
    const allSprouts = [...(twigs || []), ...(leaves || [])];
    if (
      anySprouts &&
      allSprouts
        .filter(({ props: { isDetailsRow } = {} }) => !isDetailsRow)
        .every((leaf) => leaf.props?.isChecked === true)
    ) {
      return true;
    }

    if (
      anySprouts &&
      allSprouts.some((leave) => leave.props?.isChecked === true)
    ) {
      return null;
    }

    return false;
  };

  const branchRow =
    level === 1 || item.twigs?.length > 0 || item.leaves?.length > 0
      ? buildRows(
          [groupItem(item, selectable, isChecked, level, setSize)],
          treeTableGroupColumns,
          rowTransformer
        )
      : [];

  return [
    ...branchRow,
    ...(branchRow[0]?.props?.isExpanded ? [...twigs, ...leaves] : []),
  ];
};

const chopTreeIntoTable = (
  tableTree,
  items,
  columns,
  rowTransformer = [],
  selectable = false,
  expandOnFilter
) =>
  tableTree?.reduce(
    (treeRows, item, idx) => [
      ...treeRows,
      ...buildTreeBranch(
        item,
        items,
        columns,
        rowTransformer,
        idx,
        1,
        undefined,
        selectable,
        expandOnFilter
      ),
    ],
    []
  );

const treeChopper = (items, columns, options = {}) => {
  const {
    tableTree,
    expandable: { expandRow } = {},
    bulkSelect: { markRowSelected } = {},
  } = options;
  const markRowSelectedForTreeTable =
    markRowSelected && ((...args) => markRowSelected(...args, true));
  const expandRowForTreeTable =
    expandRow && ((...args) => expandRow(...args, true));

  const choppedTree = chopTreeIntoTable(
    tableTree,
    items,
    columns,
    [markRowSelectedForTreeTable, expandRowForTreeTable],
    true
  );

  return choppedTree;
};

export default treeChopper;
