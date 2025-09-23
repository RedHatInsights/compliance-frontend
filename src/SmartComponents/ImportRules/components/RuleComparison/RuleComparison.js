import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { faker } from '@faker-js/faker';

import { Content, ContentVariants } from '@patternfly/react-core';
import { TableStateProvider } from 'bastilian-tabletools';

import ComparisonTable from './components/ComparisonTable/ComparisonTable';
import useFakeCompareData from './hooks/useFakeCompareData';

// TODO Add PDF link
const RuleComparison = ({
  policy,
  tailoring,
  sourceVersion,
  targetVersion,
  onSelect,
  selection,
  initialSelection,
  osMinorVersionToCompare,
}) => {
  const { id: policyId } = policy;
  const { id: tailoringId } = tailoring;

  // Should we need to built the initial selection with taking the target versions into account
  // this hook and the TableStateProvider should/can be moved to the ImportRules component
  const {
    loading,
    data: { data: rules, meta: { total } = {} } = {},
    error,
  } = useFakeCompareData({
    tailoringId,
    policyId,
    targetOsMinorVersion: osMinorVersionToCompare,
    // TODO remove if not needed
    sourceVersion,
    targetVersion,
  });

  const items = useMemo(
    () =>
      rules?.map((rule) => ({
        ...rule,
        isInInitialSelection: initialSelection?.includes(rule.ref_id),
        isSelected: selection?.includes(rule.ref_id),
        // TODO remove when switching to actual endpoint
        available_in_version: faker.helpers.arrayElements([
          sourceVersion.ssg_version,
          targetVersion.ssg_version,
        ]),
      })),
    [rules, sourceVersion, targetVersion, selection, initialSelection],
  );

  return (
    <>
      <Content component={ContentVariants.h2}>Rule comparison</Content>
      <ComparisonTable
        sourceVersion={sourceVersion}
        targetVersion={targetVersion}
        onSelect={onSelect}
        selection={selection}
        initialSelection={initialSelection}
        loading={loading}
        items={items}
        total={total}
        error={error}
      />
    </>
  );
};

RuleComparison.propTypes = {
  policy: propTypes.object,
  tailoring: propTypes.object,
  sourceVersion: propTypes.object,
  targetVersion: propTypes.object,
  osMinorVersionToCompare: propTypes.string,
  initialSelection: propTypes.array,
  selection: propTypes.array,
  onSelect: propTypes.func,
};

const RuleComparisonWithTableStateProvider = (props) => (
  <TableStateProvider>
    <RuleComparison {...props} />
  </TableStateProvider>
);

export default RuleComparisonWithTableStateProvider;
