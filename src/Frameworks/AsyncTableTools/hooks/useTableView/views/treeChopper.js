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
      title: (
        <DetailsComponent item={item} key={'item-details-' + item.itemId} />
      ),
      props: {
        ...(colSpan ? { colSpan } : {}),
      },
    },
  ],
});

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

const buildRows = (items, columns, rowTransformer, detailsComponent) => {
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
  idx,
  level = 1,
  setSize,
  detailsComponent,
  selectable,
  expandOnFilter = false
) => {
  const nextLevel = level + 1;
  const branchItemId = item.leaf || item.itemId;
  const isExpanded = openItems.includes(branchItemId) || false;

  const leaves = ((openItems) => {
    const leafItems =
      item.leaves?.map((item) => ({
        ...item,
        ...(items?.find(({ id }) => id === item.itemId) || {}),
        props: {
          ...(selectable ? { isChecked: item.rowProps?.selected } : {}),
          isExpanded: openItems.includes(item.itemId) || false,
          'aria-level': nextLevel,
          'aria-setsize': 1,
        },
      })) || [];

    const rows = buildRows(
      leafItems,
      columns,
      rowTransformer,
      detailsComponent
    );

    return rows;
  })(openItems);

  const twigs = item.twigs
    ? item.twigs?.flatMap((twig) => {
        const tt = buildTreeBranch(
          twig,
          items,
          openItems,
          columns,
          rowTransformer,
          idx,
          nextLevel,
          (twig.twigs?.length || 0) + (twig.leaves?.length || 0),
          detailsComponent,
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
    level === 1 || twigs.length > 0 || leaves.length > 0
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
            isExpanded,
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

const chopTreeIntoTable = (
  tableTree,
  items,
  columns,
  openItems = [],
  rowTransformer = [],
  detailsComponent,
  selectable = false,
  expandOnFilter
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
        idx,
        1,
        undefined,
        detailsComponent,
        selectable,
        expandOnFilter
      ),
    ],
    []
  );

const treeChopper = (items, columns, options = {}) => {
  const {
    tableTree,
    expandable: { openItems } = {},
    detailsComponent,
  } = options || {};

  const choppedTree = chopTreeIntoTable(
    tableTree,
    items,
    columns,
    openItems,
    undefined,
    detailsComponent
  );

  return choppedTree;
};

export default treeChopper;
