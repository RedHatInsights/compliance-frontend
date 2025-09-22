import React, { useMemo } from 'react';
import propTypes from 'prop-types';

import { ComplianceTable } from 'PresentationalComponents';

import DifferingOnlyToggle from './components/DifferingOnlyToggle';
import RuleRow from './components/RuleRow';
import defaultColumns, { profileVersion } from './columns';
import filters from './filters';

const ComparisonTable = ({
  sourceVersion,
  targetVersion,
  initialSelection,
  selection,
  onSelect,
  ...props
}) => {
  const columns = useMemo(
    () => [
      ...defaultColumns,
      profileVersion(sourceVersion, targetVersion, {
        isDisabled: true,
        selectedProp: 'isInInitialSelection',
      }),
      profileVersion(targetVersion, targetVersion, {
        selectedProp: 'isSelected',
        onSelect,
      }),
    ],
    [sourceVersion, targetVersion, onSelect],
  );

  const rowWrapper = useMemo(
    // eslint-disable-next-line react/display-name
    () => (props) => (
      <RuleRow
        {...props}
        sourceVersion={sourceVersion}
        targetVersion={targetVersion}
      />
    ),
    [targetVersion, sourceVersion],
  );

  return (
    <ComplianceTable
      {...props}
      variant="compact"
      columns={columns}
      filters={{
        filterConfig: filters,
      }}
      options={{
        debug: true,
        dedicatedAction: DifferingOnlyToggle,
      }}
      rowWrapper={rowWrapper}
    />
  );
};

ComparisonTable.propTypes = {
  sourceVersion: propTypes.object,
  targetVersion: propTypes.object,
  initialSelection: propTypes.array,
  selection: propTypes.array,
  onSelect: propTypes.func,
};

export default ComparisonTable;
