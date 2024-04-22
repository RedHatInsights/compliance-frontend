import React from 'react';
import { Text, Label, Icon } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

export const itemIdentifier = (item) => `${item.profile.id}|${item.refId}`;

const growBranch = (item, axilFunction, showFailed, idPrefix) => {
  const growTwigs = (item) => {
    return item.children
      .filter((item) => item.type === 'rule_group')
      .map((twig) => {
        const branch = growBranch(twig, axilFunction, showFailed);
        return Object.keys(branch).length > 0 && branch;
      })
      .filter((v) => !!v);
  };

  const growLeaves = (item, axilFunction) => {
    return item.children
      .filter((item) => item.type === 'rule')
      .map((item) => {
        const leaf = axilFunction(item);
        return leaf && itemIdentifier(leaf);
      })
      .filter((v) => !!v);
  };

  const leaves = growLeaves(item, axilFunction);
  const twigs = growTwigs(item);
  const failedKids = item.children.filter(
    (item) =>
      item.type === 'rule' &&
      axilFunction(item) &&
      !axilFunction(item).compliant
  );
  const failedCount =
    failedKids.length +
    twigs.reduce(
      (acc, currentTwig) => acc + (currentTwig?.failedCount || 0),
      0
    );

  const branch = {
    ...(twigs.length > 0 || leaves.length > 0
      ? {
          title: (
            <Text>
              {item.title}{' '}
              {showFailed && failedCount > 0 && (
                <Label
                  icon={
                    <Icon className="ins-u-failed">
                      <ExclamationCircleIcon />{' '}
                    </Icon>
                  }
                >
                  {failedCount}x fail
                </Label>
              )}
            </Text>
          ),
          itemId: `${idPrefix || ''}${item.id}`,
          ...(showFailed ? { failedCount } : {}),
        }
      : {}),
    ...(twigs.length > 0 ? { twigs } : {}),
    ...(leaves.length > 0 ? { leaves } : {}),
    ...(item.type === 'rule' ? { leaf: item.itemId } : {}),
  };

  return branch;
};

export const growTableTree = (profile, rules, showFailed) => {
  const { ruleTree } = profile?.benchmark || {};
  if (!ruleTree) {
    console.log('No rule tree provided');
    return;
  }

  const axilFunction = (item) => rules.find((rule) => rule.id === item.id);

  const tableTree = ruleTree.reduce((trunk, item) => {
    const branch = growBranch(item, axilFunction, showFailed, profile.id);
    const isEmpty = Object.keys(branch).length === 0;

    return [...trunk, ...(!isEmpty ? [branch] : [])];
  }, []);

  return tableTree;
};

export const checkForNonDefaultValues = (values, valueDefinitions) =>
  Object.entries(values || {}).some(([valueId, value]) => {
    const valueDefinition = valueDefinitions.find(
      (valueDefinition) =>
        valueDefinition.refId === valueId || valueDefinition.id === valueId
    );

    return value !== valueDefinition?.defaultValue;
  });

const validators = {
  number: (value) => {
    return /^\d*$/.test(value);
  },
};

export const validatorFor = (valueDefinition) =>
  validators[valueDefinition.type] || (() => true);

export const disableEdit = (value) => /(\n|\r|\\n|\\r)/.test(value);
