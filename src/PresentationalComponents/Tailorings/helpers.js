export const eventKey = ({ id, os_minor_version }) =>
  `tailoring-${id}-${os_minor_version}`;

export const buildTreeTable = (ruleTree, ruleGroups, selected) => {
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
            ...(selected ? { isChecked: selected.includes(branch.id) } : {}),
            ...branch,
          };
        }
      })
      .filter((v) => !!v);
  const tree = growTree(ruleTree);

  return tree;
};

export const prepareTreeTable = ({
  profileRuleTree,
  tailoringRuleTree,
  securityGuideRuleTree,
  selectedRules,
  ruleGroups,
}) => {
  const tree =
    ruleGroups && (tailoringRuleTree || securityGuideRuleTree)
      ? buildTreeTable(
          tailoringRuleTree || securityGuideRuleTree,
          ruleGroups?.data,
          selectedRules
        )
      : undefined;

  console.log('preparedTree', tree);
  return tree;
};

export const prepareRules = ({
  securityGuideRules,
  profileRules,
  tailoringRules,
  valueDefinitions,
  valueOverrides,
}) => {
  const rules =
    tailoringRules?.data || profileRules?.data || securityGuideRules?.data;

  const data = rules?.map((rule) => {
    const definitions = rule.value_checks?.map((checkId) =>
      valueDefinitions?.data?.find(({ id }) => id === checkId)
    );

    // TODO doublecheck, maybe the entries should rather be created from the value_checks
    const ruleValues = valueOverrides
      ? Object.fromEntries(
          Object.entries(valueOverrides).filter(([id]) =>
            rule.value_checks.includes(id)
          )
        )
      : undefined;

    return {
      // TODO This is mostly used because we lazy load definitions
      loaded: !!valueDefinitions?.data,
      ...rule,
      valueDefinitions: definitions,
      ruleValues,
    };
  });

  const preparedRules = {
    ...(tailoringRules || {}),
    ...(profileRules || {}),
    ...(securityGuideRules || {}),
    data,
  };

  console.log('prepareRules', preparedRules);
  return preparedRules;
};

const noTableStateSkips = {
  securityGuide: {
    skipRuleTree: true,
    skipRules: true,
    skipRuleGroups: true,
    skipValueDefinitions: true,
  },
  profile: {
    skipRuleTree: true,
    skipRules: true,
  },
  tailoring: {
    skipRuleTree: true,
    skipRules: true,
  },
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
  const isNewTailoring = !!policy && !tailoring && !!securityGuideId;
  const hasNoOpenItems = (openItems || []).length === 0;
  const view = tableView === 'tree' ? 'tree' : 'rows';
  const selectedRulesOnlyEnabled =
    selectedRulesOnly !== undefined && selectedRulesOnly;
  const selectedRulesOnlyDisabled =
    selectedRulesOnly !== undefined && !selectedRulesOnly;

  const skip = {
    rows: {
      securityGuide: {
        skipRuleTree: true,
        skipRules: true,
        skipRuleGroups: true,
        skipValueDefinitions: hasNoOpenItems,
      },
      profile: {
        skipRules: true,
        skipRuleTree: true,
      },
      tailoring: {
        skipRules: !tailoring,
        skipRuleTree: true,
      },
    },
    tree: {
      securityGuide: {
        skipRuleTree: true,
        skipRules: true,
        skipRuleGroups: false,
        skipValueDefinitions: hasNoOpenItems,
      },
      profile: {
        skipRules: true,
        skipRuleTree: true,
      },
      tailoring: {
        skipRules: !tailoring,
        skipRuleTree: !tailoring,
      },
    },
  };
  console.log('ALL skip', tableView, skip[view]);

  return !tableState ? noTableStateSkips : skip[view];
};
