import { buildTreeTable } from './helpers';

import ruleTree from '@/__factories__/ruleTree';
// import ruleGroups from './__factories__/ruleGroups';

describe('buildTreeTable', () => {
  it('should return a treeTable for rule groups and rules', () => {
    const tree = ruleTree.build();
    expect(buildTreeTable(tree, [])[0].leaves?.length).toEqual(2);
  });
});
