import { useState } from 'react';
import { emptyRows } from './Components/NoResultsTable';
import { chopTreeIntoTable, collectLeaves } from './rowBuilderHelpers';
import { treeRow } from '@patternfly/react-table';

const columnProp = (column) =>
  column.key || column.original?.toLowerCase() || column.title?.toLowerCase();

const itemRow = (item, columns) => ({
  ...item.rowProps,
  itemId: item.itemId,
  cells: columns.map((column) => ({
    title: column.renderFunc
      ? column.renderFunc(undefined, undefined, item)
      : item[columnProp(column)],
  })),
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

const applyTransformers = (items, transformers = []) =>
  items.map((item) => primeItem(item, transformers));

const buildRow = (item, columns, rowTransformer, idx) =>
  rowTransformer.flatMap((transformer) => {
    const row = itemRow(item, columns);
    return transformer ? transformer(row, item, columns, idx) : row;
  });

const buildRows = (paginatedItems, columns, rowTransformer) =>
  paginatedItems.length > 0
    ? paginatedItems
        .flatMap((item, idx) => buildRow(item, columns, rowTransformer, idx))
        .filter((v) => !!v)
    : [];

const useRowsBuilder = (items, columns, options = {}) => {
  const {
    transformer = [],
    rowTransformer = [],
    tableTree,
    itemIdentifier,
    detailsComponent,
    selectItems,
    unselectItems,
  } = options;
  const EmptyRowsComponent = options.emptyRows || emptyRows;
  const [openItems, setOpenItems] = useState([]);
  const transformedItems = transformer
    ? applyTransformers(items, transformer)
    : items;

  const filteredItems = options?.filter
    ? options.filter(transformedItems)
    : transformedItems;

  const sortedItems = options?.sorter
    ? options.sorter(filteredItems)
    : filteredItems;

  const paginatedItems = options?.paginator
    ? options?.paginator(sortedItems)
    : sortedItems;

  const rows =
    sortedItems.length === 0
      ? EmptyRowsComponent
      : (() => {
          return tableTree
            ? chopTreeIntoTable(
                tableTree,
                sortedItems,
                columns,
                openItems,
                rowTransformer,
                itemIdentifier,
                detailsComponent,
                options?.sorter,
                !!selectItems
              )
            : buildRows(paginatedItems, columns, rowTransformer);
        })();

  const pagination = options?.pagination
    ? {
        ...options.pagination,
        itemCount: filteredItems.length,
      }
    : undefined;

  const onCollapse = (_event, _index, _isOpen, row) => {
    if (openItems.includes(row.itemId)) {
      setOpenItems(openItems.filter((itemId) => itemId !== row.itemId));
    } else {
      setOpenItems([...openItems, row.itemId]);
    }
  };

  const onCheckedChange = (event, selected, idx, _target, row) => {
    if (row.isTreeBranch) {
      const leaves = collectLeaves(tableTree, row.itemId);
      if (row.props.isChecked) {
        unselectItems(leaves);
      } else {
        selectItems(leaves);
      }
    } else {
      !selected ? unselectItems([row.itemId]) : selectItems([row.itemId]);
    }
  };

  const treeColumns = (columns) => [
    {
      ...columns[0],
      cellTransforms: [
        ...(columns[0].cellTransforms || []),
        selectItems
          ? treeRow(onCollapse, onCheckedChange)
          : treeRow(onCollapse),
      ],
    },
    ...columns.slice(1),
  ];

  return {
    tableProps: {
      rows,
      ...(tableTree && sortedItems.length > 0
        ? {
            isTreeTable: true,
            cells: treeColumns(columns),
          }
        : {}),
    },
    toolbarProps: {
      pagination,
    },
  };
};

export default useRowsBuilder;
