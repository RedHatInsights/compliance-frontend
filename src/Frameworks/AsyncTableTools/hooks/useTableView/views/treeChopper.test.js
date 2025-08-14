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
        isItemOpen: (id) =>
          ['1st-branch', '1st-twig', exampleItems[0].itemId].includes(id),
      },
      detailsComponent: ExampleDetailsRow,
    });

    expect(rows.slice(0, 4).map(({ item: { itemId } }) => [itemId])).toEqual([
      ['1st-branch'],
      ['1st-twig'],
      ['2nd-twig'],
      ['2nd-branch'],
    ]);
  });
});
