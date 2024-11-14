import tableTree, { exampleItems } from '../../../__fixtures__/tableTree';

import treeChopper from './treeChopper';

const columns = [
  {
    title: 'Name',
    renderFunc: (_a, _b, { name }) => name,
  },
  {
    title: 'Description',
    renderFunc: (_a, _b, { description }) => description,
  },
];

const ExampleDetailsRow = ({ item }) => {
  return 'Details for :' + item.itemId;
};

describe('treeChopper', function () {
  it('should return rows for a tree table', () => {
    const rows = treeChopper(exampleItems, columns, {
      tableTree,
      expandable: {
        openItems: ['1st-branch', '1st-twig', exampleItems[0].itemId],
      },
      detailsComponent: ExampleDetailsRow,
    });

    expect(
      rows
        .slice(0, 4)
        .map(
          ({
            itemId,
            cells: [{ props }],
            props: { isDetailsRow = false } = {},
          }) => [itemId, props, isDetailsRow]
        )
    ).toEqual([
      ['1st-branch', { colSpan: 2 }, false],
      ['1st-twig', { colSpan: 2 }, false],
      [undefined, undefined, false],
      ['2nd-twig', { colSpan: 2 }, false],
    ]);
  });
});
