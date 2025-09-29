import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { TableStateProvider } from 'bastilian-tabletools';
import useReportRuleResults from 'Utilities/hooks/api/useReportRuleResults';
import { RulesTable } from 'PresentationalComponents';
import columns from './Columns';

const RuleResults = ({ reportTestResult, remediationsEnabled }) => {
  // Enable default filter
  const activeFilters = {
    'rule-state': ['failed'],
  };

  const testResultId = reportTestResult.id;
  const reportId = reportTestResult.report_id;

  const {
    loading,
    error,
    data: ruleResults,
    exporter,
    fetchAllIds: fetchAllRuleResultIds,
  } = useReportRuleResults({
    params: {
      testResultId,
      reportId,
    },
    useTableState: true,
    useQueryOptions: {
      extraParams: {
        itemIdsInTable: { idsOnly: true },
      },
    },
  });

  // TODO clean up and make columns use new object properties
  const transformRules = (ruleResults, reportTestResult) => {
    return ruleResults !== undefined
      ? ruleResults.map((rule) => ({
          ...rule,
          profile: { name: reportTestResult.title },
        }))
      : [];
  };

  const rules = useMemo(
    () => transformRules(ruleResults?.data, reportTestResult),
    [ruleResults, reportTestResult],
  );

  return (
    <RulesTable
      loading={loading}
      error={error}
      activeFilters={activeFilters}
      ansibleSupportFilter
      rules={rules.map((rule) => ({ ...rule, itemId: rule.id }))}
      columns={columns}
      policyId={reportTestResult.report_id}
      total={ruleResults?.meta?.total}
      defaultTableView="rows"
      onSelect={true}
      remediationsEnabled={remediationsEnabled}
      reportTestResult={reportTestResult}
      skipValueDefinitions={true}
      options={{
        exporter,
        itemIdsInTable: fetchAllRuleResultIds,
      }}
      // TODO: provide ruleTree
    />
  );
};

RuleResults.propTypes = {
  remediationsEnabled: propTypes.bool,
  reportTestResult: propTypes.object,
};

const RuleResultsWrapper = (props) => {
  return (
    <TableStateProvider>
      <RuleResults {...props} />
    </TableStateProvider>
  );
};
export default RuleResultsWrapper;
