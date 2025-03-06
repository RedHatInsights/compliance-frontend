import { buildRows, groupItem, isBranchChecked } from './helpers';

const buildTreeBranch = (
  tableTree,
  item,
  items,
  level = 1,
  setSize,
  selectable,
  isItemOpen,
  isItemSelected
) => {
  const nextLevel = level + 1;
  const isOpen = isItemOpen(item.itemId);

  const leaves = item.leaves
    ? item.leaves
        .map((leaf) => items?.find(({ itemId }) => itemId === leaf.itemId))
        .filter((v) => !!v)
        .map((item) => ({
          ...item,
          props: {
            ...item.props,
            'aria-level': nextLevel,
            'aria-setsize': 1, // TODO this should maybe depend on wether or not it has a details row
          },
        }))
    : [];

  const twigs = item.twigs
    ? item.twigs.flatMap((twig) =>
        buildTreeBranch(
          tableTree,
          twig,
          items,
          nextLevel,
          (twig.twigs?.length || 0) + (twig.leaves?.length || 0),
          selectable,
          isItemOpen,
          isItemSelected
        )
      )
    : [];

  const isChecked = selectable
    ? isBranchChecked(tableTree, item, isItemSelected)
    : undefined;

  const branchRow =
    level === 1 || item.twigs?.length > 0 || item.leaves?.length > 0
      ? [groupItem(item, isChecked, level, setSize)]
      : [];

  return [...branchRow, ...(isOpen ? [...twigs, ...leaves] : [])];
};

const chopTreeIntoRowItems = (
  tableTree,
  items,
  selectable = false,
  isItemOpen,
  isItemSelected
) =>
  tableTree?.reduce(
    (treeRows, item) => [
      ...treeRows,
      ...buildTreeBranch(
        tableTree,
        item,
        items,
        1,
        undefined,
        selectable,
        isItemOpen,
        isItemSelected
      ),
    ],
    []
  );

const treeChopper = (items, columns, options = {}) => {
  const {
    tableTree,
    expandable: { enableExpandingRow, expandRow, isItemOpen } = {},
    bulkSelect: { enableBulkSelect, markRowSelected, isItemSelected } = {},
  } = options;

  const markRowSelectedForTreeTable = (...args) =>
    markRowSelected(...args, true);
  const expandRowForTreeTable = (...args) => expandRow(...args, true);
  const rowTransformers = [
    ...(enableBulkSelect ? [markRowSelectedForTreeTable] : []),
    ...(enableExpandingRow ? [expandRowForTreeTable] : []),
  ];

  const choppedTree = chopTreeIntoRowItems(
    tableTree,
    items,
    enableBulkSelect,
    isItemOpen,
    isItemSelected
  );

  return buildRows(choppedTree, columns, rowTransformers);
};

export default treeChopper;
