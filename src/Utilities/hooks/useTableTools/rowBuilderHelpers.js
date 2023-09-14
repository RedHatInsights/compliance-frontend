import React from 'react';

const columnProp = (column) =>
  column.key || column.original?.toLowerCase() || column.title?.toLowerCase();

const itemRow = (item, columns) => ({
  props: {
    ...(item.props || {}),
  },
  itemId: item.itemId,
  cells: columns.map((column) => ({
    title: column.renderFunc
      ? column.renderFunc(undefined, undefined, item)
      : item[columnProp(column)],
  })),
});

const childRowForItem = (item, idx, DetailsComponent, colSpan) => ({
  props: {
    'aria-level': item.props['aria-level'],
    isDetailsRow: true,
  },
  cells: [
    {
      title: <DetailsComponent item={item} key={'item-' + item.rowId} />,
      props: {
        ...(colSpan ? { colSpan } : {}),
        className: 'compliance-rule-details',
      },
    },
  ],
});

const primeItem = (item, transformers) => {
  let newItem = item;

  transformers.forEach((transformer) => {
    if (transformer) {
      newItem = transformer(newItem);
    }
  });

  return newItem;
};

export const applyTransformers = (items, transformers = []) =>
  items.map((item) => primeItem(item, transformers));

const buildRow = (item, columns, rowTransformer, detailsComponent, idx) =>
  (rowTransformer.length > 0 ? rowTransformer : [(row) => row]).flatMap(
    (transformer) => {
      const row = itemRow(item, columns);
      const transformedRow = transformer
        ? transformer(row, item, columns, idx)
        : row;
      const childRow =
        item.props?.isExpanded &&
        detailsComponent &&
        childRowForItem(item, idx, detailsComponent, columns.length);
      return [transformedRow, ...(childRow ? [childRow] : [])];
    }
  );

export const buildRows = (items, columns, rowTransformer, detailsComponent) => {
  return items
    .flatMap((item, idx) =>
      buildRow(item, columns, rowTransformer, detailsComponent, idx)
    )
    .filter((v) => !!v);
};

const buildTreeBranch = (
  item,
  items,
  openItems,
  columns,
  rowTransformer,
  itemIdentifier,
  idx,
  level = 1,
  setSize,
  detailsComponent,
  sorter,
  selectable,
  expandOnFilter = false,
  activeFilterValues
) => {
  const nextLevel = level + 1;
  const branchItemId = item.leaf || item.itemId;
  const isExpanded =
    (expandOnFilter && activeFilterValues.flat().length > 0) ||
    openItems.includes(branchItemId);

  const leaves = ((openItems) => {
    const leafItems =
      item.leaves
        ?.map((leafId) => items.find(({ itemId }) => itemId === leafId))
        .filter((v) => !!v)
        .map((item) => ({
          ...item,
          props: {
            ...(selectable ? { isChecked: item.rowProps?.selected } : {}),
            isExpanded:
              (expandOnFilter && activeFilterValues?.flat().length > 0) ||
              openItems.includes(item.itemId),
            'aria-level': nextLevel,
            'aria-setsize': 1,
          },
        })) || [];

    const sortedItems = sorter?.(leafItems) || leafItems;
    const rows = buildRows(
      sortedItems,
      columns,
      rowTransformer,
      detailsComponent
    );

    return rows;
  })(openItems);

  const twigs = item.twigs
    ? item.twigs.flatMap((twig) =>
        buildTreeBranch(
          twig,
          items,
          openItems,
          columns,
          rowTransformer,
          itemIdentifier,
          idx,
          nextLevel,
          (twig.twigs?.length || 0) + (twig.leaves?.length || 0),
          detailsComponent,
          sorter,
          selectable,
          expandOnFilter,
          activeFilterValues
        )
      )
    : [];

  const isChecked = () => {
    const anySprouts = leaves.length > 0 || twigs.length > 0;
    const allSprouts = [...(twigs || []), ...(leaves || [])];
    if (
      anySprouts &&
      allSprouts
        .filter(({ props: { isDetailsRow } }) => !isDetailsRow)
        .every((leaf) => leaf.props.isChecked === true)
    ) {
      return true;
    }

    if (
      anySprouts &&
      allSprouts.some((leave) => leave.props.isChecked === true)
    ) {
      return null;
    }

    return false;
  };

  const branchRow =
    twigs.length > 0 || leaves.length > 0
      ? [
          {
            cells: [
              {
                title: <strong>{item.title}</strong>,
                props: { colSpan: columns.length },
              },
            ],
            itemId: branchItemId,
            isTreeBranch: true,
            props: {
              ...(selectable
                ? {
                    isChecked: isChecked(),
                  }
                : {}),
              isExpanded,
              'aria-level': level,
              'aria-setsize':
                setSize || (twigs.length || 0) + (leaves.length || 0),
            },
          },
        ]
      : [];

  const branch = item.leaf
    ? buildRow(
        items.find(({ itemId }) => itemId === item.leaf),
        columns,
        rowTransformer,
        idx
      )
    : [...branchRow, ...(isExpanded ? [...twigs, ...leaves] : [])];

  return branch;
};

export const chopTreeIntoTable = (
  tableTree,
  items,
  columns,
  openItems = [],
  rowTransformer = [],
  itemIdentifier = ({ id }) => id,
  detailsComponent,
  sorter,
  selectable = false,
  expandOnFilter,
  activeFilterValues
) =>
  tableTree.reduce(
    (treeRows, item, idx) => [
      ...treeRows,
      ...buildTreeBranch(
        item,
        items,
        openItems,
        columns,
        rowTransformer,
        itemIdentifier,
        idx,
        1,
        undefined,
        detailsComponent,
        sorter,
        selectable,
        expandOnFilter,
        activeFilterValues
      ),
    ],
    []
  );

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

export const findParentsForItemInTree = (tableTree) => (itemId) => {
  let parents;
  const findParents = (branches = [], itemId, parentBranches = []) => {
    for (let branch of branches) {
      const hasItem =
        branch.leaves?.some((currentItemId) => currentItemId === itemId) ||
        branch.leaf === itemId;

      if (hasItem) {
        parents = [branch.itemId, ...parentBranches];
        break;
      } else {
        findParents(branch.twigs || [], itemId, [
          branch.itemId,
          ...parentBranches,
        ]);
      }
    }
  };

  findParents(tableTree, itemId);

  return parents || [];
};
