import NoResultsTable from '../../components/AsyncTableToolsTable/NoResultsTable';

const emptyRows = (colSpan) => [
  {
    cells: [
      {
        title: NoResultsTable,
        props: {
          colSpan,
        },
      },
    ],
  },
];

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

const buildRow = (item, columns, rowTransformer, idx) => {
  if (rowTransformer) {
    return rowTransformer.flatMap((transformer) => {
      const row = itemRow(item, columns);
      return transformer ? transformer(row, item, columns, idx) : row;
    });
  } else {
    return itemRow(item, columns);
  }
};

const rowsBuilder = (items, columns, options = {}) => {
  const { transformer, rowTransformer } = options;
  const EmptyRowsComponent = options.emptyRows || emptyRows(columns.length);
  const transformedItems = transformer
    ? applyTransformers(items, transformer)
    : items;
  console.log('Items to build rows for', items, 'with', columns);
  const rows =
    transformedItems.length > 0
      ? transformedItems
          .flatMap((item, idx) => buildRow(item, columns, rowTransformer, idx))
          .filter((v) => !!v)
      : EmptyRowsComponent;

  const pagination = options?.pagination
    ? {
        ...options.pagination,
        itemCount: 10,
      }
    : undefined;

  return {
    tableProps: {
      rows,
    },
    toolbarProps: {
      pagination,
    },
  };
};

export default rowsBuilder;
