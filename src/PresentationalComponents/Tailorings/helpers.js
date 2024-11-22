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

export const skips = ({
  policy,
  tailoring,
  securityGuideId,
  profileId,
  tableState,
}) => {
  const {
    selectedRulesOnly,
    tableView,
    ['open-items']: openItems,
  } = tableState?.tableState || {};
  const hasMissingParams = !policy && !tailoring;
  const hasNoTableState = !tableState;
  const isTailoringWithPolicy = !!policy && !!tailoring;
  const isNewTailoring = !!policy && !tailoring && !!securityGuideId;
  const hasNoOpenItems = (openItems || []).length === 0;
  const isTreeView = tableView === 'tree';

  return {
    securityGuide: {
      ruleGroups: hasNoTableState,
      ruleTree: hasNoTableState || selectedRulesOnly,
      rules:
        hasNoTableState || (isTreeView && hasNoOpenItems) || selectedRulesOnly,
      valueDefinitions: hasNoTableState || hasNoOpenItems,
      profile: {
        rules:
          hasNoTableState ||
          isTailoringWithPolicy ||
          (isTreeView && hasNoOpenItems) ||
          !selectedRulesOnly ||
          !profileId,
        ruleTree:
          hasNoTableState ||
          isTailoringWithPolicy ||
          !selectedRulesOnly ||
          !profileId,
      },
    },
    tailoring: {
      rules:
        (isTreeView && hasNoOpenItems) ||
        hasNoTableState ||
        hasMissingParams ||
        isNewTailoring ||
        !selectedRulesOnly,
      ruleTree:
        hasNoTableState ||
        hasMissingParams ||
        isNewTailoring ||
        !selectedRulesOnly,
    },
  };
};
