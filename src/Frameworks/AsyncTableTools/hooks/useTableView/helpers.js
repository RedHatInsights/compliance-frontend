import { treeRow } from '@patternfly/react-table';

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
      const idsForSelect = row.isTreeBranch
        ? collectLeaves(options.tableTree, row.itemId).map(
            ({ itemId }) => itemId
          )
        : row.itemId;

      !(row.props?.isChecked || row.isChecked)
        ? select(idsForSelect)
        : deselect(idsForSelect);
    })
  );
};
