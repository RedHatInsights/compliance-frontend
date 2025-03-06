import { uniq, unionBy } from 'lodash';

const sortNodes = (a, b) => {
  const A = a.title?.toUpperCase();
  const B = b.title?.toUpperCase();
  return A < B ? -1 : A > B ? 1 : 0;
};

export const buildTreeTable = (ruleTree, ruleGroups) => {
  const growTree = (ruleTree, parents) =>
    ruleTree
      ?.map((branch) => {
        if (branch.type === 'rule_group') {
          const currentParents = [...(parents || []), branch.id];
          const ruleGroup = ruleGroups?.find(({ id }) => id === branch.id);

          const children =
            branch.children?.length > 0
              ? growTree(branch.children, currentParents)
              : undefined;

          return children?.length > 0
            ? {
                type: branch.type,
                itemId: branch.id,
                ...(ruleGroup ? { title: ruleGroup.title } : {}),
                twigs: children
                  ?.filter(({ type }) => type === 'rule_group')
                  .sort(sortNodes),
                leaves: children
                  ?.filter(({ type }) => type === 'rule')
                  .sort(sortNodes),
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

  return growTree(ruleTree);
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
  const rulesWithGroups = rules?.reduce((groupedRules, ruleId) => {
    const groupsForRule = findGroupsForRule(ruleId, securityGuideRuleTree);

    return {
      ...groupedRules,
      [ruleId]: groupsForRule,
    };
  }, {});
  const groupsRules = uniq(Object.values(rulesWithGroups || {}).flat(Infinity));
  const filterTwigs = (filteredTwigs, branch) => {
    const twigs = branch.twigs
      ?.filter(({ itemId }) => groupsRules.includes(itemId))
      .flatMap((branch) => filterTwigs([], branch));
    const leaves = branch.leaves?.filter(({ itemId }) =>
      rules.includes(itemId)
    );

    return [
      ...filteredTwigs,
      ...(leaves.length || twigs.length
        ? [
            {
              ...branch,
              ...(twigs.length ? { twigs } : {}),
              ...(leaves.length ? { leaves } : {}),
            },
          ]
        : []),
    ];
  };

  return securityGuideRuleTree?.reduce(filterTwigs, []);
};

const mergeTree = (firstTree = [], secondTree = []) => {
  const combinedTrunk = unionBy(firstTree, secondTree, 'itemId');

  const combineBranches = (combinedBranches, branch) => {
    const branchInFirstTree = firstTree.find(
      ({ itemId }) => itemId === branch.itemId
    );
    const branchInSecondTree = secondTree.find(
      ({ itemId }) => itemId === branch.itemId
    );

    return [
      ...combinedBranches,
      {
        ...branch,
        ...branchInFirstTree,
        ...branchInSecondTree,
        twigs: mergeTree(
          branchInFirstTree?.twigs,
          branchInSecondTree?.twigs
        ).sort(sortNodes),
      },
    ];
  };

  return combinedTrunk.reduce(combineBranches, []);
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
  const additionalRulesTree =
    builtSecurityGuideTree &&
    groupRulesInGroups(additionalRules, builtSecurityGuideTree);
  const tree =
    ruleGroups &&
    (profileRuleTree || tailoringRuleTree || securityGuideRuleTree)
      ? buildTreeTable(
          tailoringRuleTree || profileRuleTree || securityGuideRuleTree,
          ruleGroups?.data
        )
      : undefined;

  return mergeTree(additionalRulesTree, tree);
};

export default prepareTreeTable;
