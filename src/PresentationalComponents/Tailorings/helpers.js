export const eventKey = ({ id, os_minor_version }) =>
  `tailoring-${id}-${os_minor_version}`;

export const buildTreeTable = (ruleTree, ruleGroups) => {
  const growTree = (ruleTree) => {
    return ruleTree.map((branch) => {
      if (branch.type === 'rule_group') {
        // console.log('branch', JSON.stringify(branch, undefined, 1));
        const ruleGroup = ruleGroups.find(({ id }) => id === branch.id);
        const children = branch.children && growTree(branch.children);
        // console.log('kids', JSON.stringify(children, undefined, 1));

        return {
          type: branch.type,
          itemId: branch.id,
          ...(ruleGroup ? { title: ruleGroup.title } : {}),
          ...(children
            ? {
                twigs: children.filter(({ type }) => type === 'rule_group'),
                leaves: children.filter(({ type }) => type === 'rule'),
              }
            : {}),
        };
      } else {
        // console.log('other', branch);
        return {
          itemId: branch.id,
          ...branch,
        };
      }
    });
  };
  const tree = growTree(ruleTree);
  // console.log('Resulting Tree', JSON.stringify(tree, undefined, 1));
  return tree;
};
