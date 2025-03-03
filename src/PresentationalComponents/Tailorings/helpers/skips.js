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

const skipProfiles = ({
  policy,
  tailoring,
  securityGuideId,
  profileId,
  tableState,
}) => {
  const { selectedRulesOnly, ['open-items']: openItems } =
    tableState?.tableState || {};
  const hasNoOpenItems = (openItems || []).length === 0;
  const selectedRulesOnlyEnabled =
    selectedRulesOnly !== undefined && selectedRulesOnly;
  const selectedRulesOnlyDisabled =
    selectedRulesOnly !== undefined && !selectedRulesOnly;

  return {
    'policy-details': {
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
          skipRules: !securityGuideId || hasNoOpenItems,
          skipRuleGroups: !securityGuideId,
          skipValueDefinitions: hasNoOpenItems,
        },
        profile: {
          skipRules: true,
          skipRuleTree: true,
        },
        tailoring: {
          skipRules: !tailoring || hasNoOpenItems,
          skipRuleTree: !tailoring,
        },
      },
    },
    'edit-policy': {
      rows: {
        securityGuide: {
          skipRuleTree: true,
          skipRules: selectedRulesOnlyEnabled,
          skipRuleGroups: true,
          skipValueDefinitions: hasNoOpenItems,
        },
        profile: {
          skipRules: true,
          skipRuleTree: true,
        },
        tailoring: {
          skipRules: !tailoring || selectedRulesOnlyDisabled,
          skipRuleTree: true,
        },
      },
      tree: {
        securityGuide: {
          skipRuleTree: !securityGuideId,
          skipRules: !securityGuideId || hasNoOpenItems,
          skipRuleGroups: !securityGuideId,
          skipValueDefinitions: hasNoOpenItems,
        },
        profile: {
          skipRules: true,
          skipRuleTree: true,
        },
        tailoring: {
          skipRules: !tailoring || selectedRulesOnlyDisabled || hasNoOpenItems,
          skipRuleTree: !tailoring || selectedRulesOnlyDisabled,
        },
      },
    },
  };
};

export const skips = ({
  skipProfile,
  policy,
  tailoring,
  securityGuideId,
  profileId,
  tableState,
}) => {
  const view = tableState?.tableState?.tableView === 'tree' ? 'tree' : 'rows';

  console.log('Skips input', {
    skipProfile,
    policy,
    tailoring,
    securityGuideId,
    profileId,
    tableState,
  });
  const skipsResult =
    !tableState && !skipProfile
      ? noTableStateSkips
      : skipProfiles({
          policy,
          tailoring,
          securityGuideId,
          profileId,
          tableState,
        })?.[skipProfile]?.[view];

  console.log('Skips', skipsResult);
  return skipsResult;
};

export default skips;
