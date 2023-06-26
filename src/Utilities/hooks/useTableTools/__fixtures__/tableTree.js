import items from './items';

export const exampleItems = items(30).map((item) => ({
  ...item,
  itemId: 'item-' + item.id,
}));

const item = (idx) => exampleItems[idx - 1].itemId;

export default [
  {
    title: '1st Branch',
    itemId: '1st-branch',
    twigs: [
      {
        itemId: '1st-twig',
        title: '1st Twig',
        leaves: [item(1)],
      },
      {
        itemId: '2nd-twig',
        title: '2nd Twig',
        leaves: [item(2), item(3)],
      },
    ],
  },
  {
    title: '2nd Branch',
    itemId: '2nd-branch',
    twigs: [
      {
        itemId: '2nd-branch-1st-twig',
        title: '2nd Branch 1st Twig',
        leaves: [item(4)],
      },
      {
        itemId: '2nd-branch-2nd-twig',
        title: '2nd Branch 2nd Twig',
        twigs: [
          {
            itemId: '2nd-branch-2nd-twig-1st-twig',
            title: '2nd Branch 2nd Twig 1st Twig',
            leaves: [item(5), item(6)],
          },
        ],
      },
    ],
  },
  {
    title: '3rd Branch',
    itemId: '3rd-branch',
    leaf: item(7),
  },
  {
    title: '4th Branch',
    itemId: '4th-branch',
    leaves: [item(8)],
  },
];
