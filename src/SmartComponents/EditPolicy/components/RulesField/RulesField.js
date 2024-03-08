import React, { useCallback, useEffect, useState } from 'react';
import { Text, TextContent, Spinner } from '@patternfly/react-core';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import { TabbedRules } from 'PresentationalComponents/TabbedRules';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import useBenchmarksQuery from 'Utilities/hooks/useBenchmarksQuery';
import EmptyState from './components/EmptyState';
import { toTabsData } from './helpers';
// import useResetRules from './hooks/useResetRules';
import useOsMinorVersionCounts from './hooks/useOsMinorVersionCounts';

export const EditPolicyRulesTab = (props) => {
  const [tabbedRulesData, setTabbedRulesData] = useState();
  const {
    policy,
    input: { onChange, value },
  } = useFieldApi(props);
  const { getFieldState } = useFormApi();
  const systems = getFieldState('systems');
  const { systemsOsMinorVersions, systemsOsMinorVersionCounts } =
    useOsMinorVersionCounts(policy, systems);
  const { data, loading, error } = useBenchmarksQuery(
    policy?.osMajorVersion,
    systemsOsMinorVersions
  );
  const benchmarks = data?.benchmarks?.nodes;
  // const { reset } = useResetRules(policy, systemsOsMinorVersions, benchmarks);

  useEffect(() => {
    if (policy && systemsOsMinorVersionCounts && benchmarks) {
      setTabbedRulesData(
        toTabsData(policy, systemsOsMinorVersionCounts, benchmarks)
      );
    }
  }, [policy, systemsOsMinorVersionCounts, benchmarks]);

  const onRulesChange = useCallback((value) => {
    console.log(value);
    onChange?.(value);
  });

  const onRuleValuesChange = useCallback((value) => {
    console.log(value);
    onChange?.(value);
  });

  return (
    <StateViewWithError
      stateValues={{
        error,
        data: tabbedRulesData,
        loading: loading && benchmarks?.length === 0,
        empty: !loading && benchmarks?.length === 0,
      }}
    >
      <StateViewPart stateKey="loading">
        <EmptyTable>
          <Spinner />
        </EmptyTable>
      </StateViewPart>
      <StateViewPart stateKey="data">
        <TextContent>
          <Text>
            Different release versions of RHEL are associated with different
            versions of the SCAP Security Guide (SSG), therefore each release
            must be customized independently.
          </Text>
        </TextContent>
        <TabbedRules
          resetLink
          rulesPageLink
          selectedFilter
          remediationsEnabled={false}
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          tabsData={tabbedRulesData}
          ruleValues={value.ruleValues}
          selectedRuleRefIds={value}
          setSelectedRuleRefIds={onRulesChange}
          setRuleValues={onRuleValuesChange}
          level={1}
          ouiaId="RHELVersions"
        />
      </StateViewPart>
      <StateViewPart stateKey="empty">
        <EmptyState />
      </StateViewPart>
    </StateViewWithError>
  );
};

export default EditPolicyRulesTab;
