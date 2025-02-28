import xor from 'lodash/xor';

export const buildTreeTable = (
  ruleTree,
  ruleGroups,
  additionalRulesInGroups
) => {
  const growTree = (ruleTree, parents) =>
    ruleTree
      .map((branch) => {
        if (branch.type === 'rule_group') {
          const currentParents = [...(parents || []), branch.id];
          const ruleGroup = ruleGroups.find(({ id }) => id === branch.id);
          const additionalRulesForBranch = Object.entries(
            additionalRulesInGroups || {}
          )
            .filter(([, groups]) => xor(groups, currentParents).length === 0)
            .map(([id]) => id);
          const allChildren = [
            ...(additionalRulesForBranch
              ?.filter(
                (itemId, index) =>
                  index === branch.children?.findIndex((o) => itemId === o.id)
              )
              .map((id) => ({
                type: 'rule',
                id,
              })) || []),
            ...(branch.children || []),
          ];

          const children =
            allChildren.length > 0
              ? growTree(allChildren, currentParents)
              : undefined;

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
const findGroupsForRule = (rule, securityGuideRuleTree) => {
  const findRule = (foundResult, branch, _idx, _arr, parents) => {
    const currentParents = [...(parents || []), branch.itemId];
    if (branch.leaves?.map(({ itemId }) => itemId).includes(rule)) {
      foundResult = currentParents;
    }

    if (branch.twigs) {
      foundResult = branch.twigs.reduce(
        (foundResult, branch, _idx, _arr) =>
          findRule(foundResult, branch, _idx, _arr, currentParents),
        foundResult
      );
    }

    return foundResult;
  };

  return securityGuideRuleTree.reduce(findRule, undefined);
};

const groupRulesInGroups = (rules, securityGuideRuleTree) => {
  const rulesInGroups = rules.reduce((groupedRules, ruleId) => {
    const groupsForRule = findGroupsForRule(ruleId, securityGuideRuleTree);

    return {
      ...groupedRules,
      [ruleId]: groupsForRule,
    };
  }, {});

  return rulesInGroups;
};

const prepareTreeTable = ({
  profileRuleTree,
  tailoringRuleTree,
  securityGuideRuleTree,
  ruleGroups,
  additionalRules,
}) => {
  const builtSecurityGuideTree =
    ruleGroups &&
    securityGuideRuleTree &&
    buildTreeTable(securityGuideRuleTree, ruleGroups?.data);
  const additionalRulesInGroups =
    builtSecurityGuideTree &&
    groupRulesInGroups(additionalRules, builtSecurityGuideTree);

  const tree =
    ruleGroups &&
    (profileRuleTree || tailoringRuleTree || securityGuideRuleTree)
      ? buildTreeTable(
          tailoringRuleTree || profileRuleTree || securityGuideRuleTree,
          ruleGroups?.data,
          additionalRulesInGroups
        )
      : undefined;

  return tree;
};

export default prepareTreeTable;
