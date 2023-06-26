import tableTree, { exampleItems } from './__fixtures__/tableTree';
import {
  chopTreeIntoTable,
  collectLeaves,
  findParentsForItemInTree,
} from './rowBuilderHelpers';

const exampleColumns = [{ title: 'Name', key: 'name' }];

describe('chopTreeIntoTable', () => {
  it('returns rows in a tree', () => {
    expect(
      chopTreeIntoTable(tableTree, exampleItems, exampleColumns)
    ).toMatchSnapshot();
  });

  it('returns expanded rows in a tree', () => {
    expect(
      chopTreeIntoTable(tableTree, exampleItems, exampleColumns, '1st_branch-0')
    ).toMatchSnapshot();
  });
});

describe('collectLeaves', () => {
  it('returns leaves of all branches', () => {
    expect(collectLeaves(tableTree)).toMatchSnapshot();
  });

  it('returns leaves of a specific branch', () => {
    expect(collectLeaves(tableTree, '2nd-twig')).toMatchSnapshot();
    expect(collectLeaves(tableTree, '2nd-branch')).toMatchSnapshot();
    expect(collectLeaves(tableTree, '2nd-branch-1st-twig')).toMatchSnapshot();
    expect(
      collectLeaves(tableTree, '2nd-branch-2nd-twig-1st-twig')
    ).toMatchSnapshot();
    expect(collectLeaves(tableTree, '3rd-branch')).toMatchSnapshot();
  });
});

describe('findParentsForItemInTree', () => {
  console.log(tableTree);
  it('returns the parents for a first level a given itemId', () => {
    expect(findParentsForItemInTree(tableTree)('item-8')).toEqual([
      '4th-branch',
    ]);
  });

  it('returns the parents for a leaf item with the given itemId', () => {
    expect(findParentsForItemInTree(tableTree)('item-7')).toEqual([
      '3rd-branch',
    ]);
  });

  it('returns the parents for a given itemId', () => {
    expect(findParentsForItemInTree(tableTree)('item-6').sort()).toEqual(
      [
        '2nd-branch',
        '2nd-branch-2nd-twig',
        '2nd-branch-2nd-twig-1st-twig',
      ].sort()
    );
  });
});
