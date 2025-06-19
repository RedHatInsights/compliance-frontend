import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

export const collectIdsFromTree = (
  node,
  ruleGroupIds = [],
  ruleAndGroupIds = [],
  parentRuleGroupId = null,
) => {
  if (node.type === 'rule_group') {
    ruleGroupIds.push(node.id);
    node.children.forEach((child) =>
      collectIdsFromTree(child, ruleGroupIds, ruleAndGroupIds, node.id),
    );
  } else if (node.type === 'rule') {
    ruleAndGroupIds.push({ id: node.id, groupId: parentRuleGroupId });
  }
  return { ruleGroupIds, ruleAndGroupIds };
};

const ruleFactory = Factory.define(() => ({
  id: faker.string.uuid(),
  type: 'rule',
}));

const ruleGroupFactory = Factory.define(({ transientParams }) => {
  const {
    depth = 3,
    minChildren = 2,
    maxChildren = 4,
    ruleProbability = 0.5,
  } = transientParams;

  if (depth === 0) {
    return ruleFactory.build();
  }

  let children = [];
  const childrenCount = faker.number.int({
    min: minChildren,
    max: maxChildren,
  });

  for (let i = 0; i < childrenCount; i++) {
    if (Math.random() < ruleProbability) {
      children.push(ruleFactory.build());
    } else {
      children.push(
        ruleGroupFactory.build(
          {},
          {
            transient: {
              depth: depth - 1,
              maxChildren,
              ruleProbability,
            },
          },
        ),
      );
    }
  }

  return {
    id: faker.string.uuid(),
    type: 'rule_group',
    children,
  };
});

const ruleTreeFactory = Factory.define(({ transientParams }) => {
  let ruleGroupCount = { count: 0 };
  let tree = ruleGroupFactory.build(
    {},
    { transient: { ...transientParams, ruleGroupCount } },
  );

  return tree;
});

export const extendRuleTree = (ruleTree, additionalNode = {}) => {
  return {
    ...ruleTree,
    children: [...ruleTree.children, additionalNode],
  };
};

export default ruleTreeFactory;
