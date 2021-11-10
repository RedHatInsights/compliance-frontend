import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
// eslint-disable-next-line
import ComplianceRemediationButton from 'PresentationalComponents/ComplianceRemediationButton';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import { toRulesArrayWithProfile } from 'Utilities/ruleHelpers';
import RuleDetailsRow from './RuleDetailsRow';
import emptyRows from './EmptyRows';
import buildFilterConfig from './Filters';
import defaultColumns from './Columns';

const RulesTable = ({
  system,
  profileRules,
  columns = defaultColumns,
  remediationsEnabled = true,
  remediationAvailableFilter = false,
  selectedFilter = false,
  handleSelect,
  selectedRefIds = [],
  hidePassed = false,
  options,
  ...rulesTableProps
}) => {
  const rules = toRulesArrayWithProfile(profileRules);
  const showPassFailFilter =
    columns.filter((c) => c.title === 'Passed').length > 0;
  const policies = profileRules
    .filter(({ profile }) => !!profile)
    .map(({ profile }) => ({
      id: profile.policy ? profile.policy.id : profile.id,
      name: profile.name,
    }));

  const remediationAction = ({ selected: selectedRules }) => (
    <ComplianceRemediationButton
      allSystems={[
        {
          id: system.id,
          profiles: system.testResultProfiles,
          ruleObjectsFailed: [],
          supported: system.supported,
        },
      ]}
      selectedRules={(selectedRules || []).filter(
        (rule) => rule.remediationAvailable
      )}
    />
  );

  return (
    <TableToolsTable
      aria-label="Rules Table"
      items={rules}
      columns={columns}
      isStickyHeader
      filters={{
        filterConfig: buildFilterConfig({
          showPassFailFilter,
          policies,
          remediationAvailableFilter,
        }),
        ...(hidePassed && {
          activeFilters: {
            passed: ['failed'],
          },
        }),
      }}
      options={{
        ...COMPLIANCE_TABLE_DEFAULTS,
        ...options,
        identifier: (item) => item.refId,
        selectable: !!handleSelect || remediationsEnabled,
        onSelect: handleSelect,
        preselected: selectedRefIds,
        detailsComponent: RuleDetailsRow,
        emptyRows: emptyRows(columns),
        selectedFilter,
        ...(remediationsEnabled ? { dedicatedAction: remediationAction } : {}),
      }}
      {...rulesTableProps}
    />
  );
};

RulesTable.propTypes = {
  profileRules: propTypes.array,
  loading: propTypes.bool,
  hidePassed: propTypes.bool,
  system: propTypes.object,
  remediationsEnabled: propTypes.bool,
  remediationAvailableFilter: propTypes.bool,
  selectedRefIds: propTypes.array,
  selectedFilter: propTypes.bool,
  handleSelect: propTypes.func,
  columns: propTypes.array,
  options: propTypes.object,
};

export default RulesTable;
