export const eventKey = ({ id, os_minor_version }) =>
  `tailoring-${id}-${os_minor_version}`;

export const buildTreeTable = (ruleTree, ruleGroups) => {
  const growTree = (ruleTree) =>
    ruleTree
      .map((branch) => {
        if (branch.type === 'rule_group') {
          const ruleGroup = ruleGroups.find(({ id }) => id === branch.id);
          const children =
            branch.children?.length > 0 ? growTree(branch.children) : undefined;

          return children?.length > 0
            ? {
                type: branch.type,
                itemId: branch.id,
                ...(ruleGroup ? { title: ruleGroup.title } : {}),
                twigs: children?.filter(({ type }) => type === 'rule_group'),
                leaves: children?.filter(({ type }) => type === 'rule'),
              }
            : undefined;
        } else {
          return {
            itemId: branch.id,
            ...branch,
          };
        }
      })
      .filter((v) => !!v);
  const tree = growTree(ruleTree);

  return tree;
};

export const skips = (policy, tailoring, securityGuide, tableState) => {
  const { tableView, ['open-items']: openItems } = tableState?.tableState || {};

  return {
    tailoring: {
      rules:
        !tableState ||
        !(policy && tailoring) ||
        (tableView === 'tree' && !openItems.length === 0),
      ruleTree: !tableState || !(policy && tailoring) || tableView === 'rows',
    },
    securityGuide: {
      rules:
        !tableState ||
        !securityGuide ||
        (tableView === 'tree' && !openItems?.length === 0),
      ruleTree: !tableState || !securityGuide || tableView === 'rows',
      ruleGroups: !tableState || tableView === 'rows',
      valueDefinitions: !tableState,
    },
  };
};
