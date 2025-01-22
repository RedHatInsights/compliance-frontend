import React, { useMemo } from 'react';
import RulesTable from '../../PresentationalComponents/RulesTable/RulesTableRest';
import propTypes from 'prop-types';
import TableStateProvider from '../../Frameworks/AsyncTableTools/components/TableStateProvider';
import { useFullTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import columns from './Columns';
import useRuleResultsData from './hooks/useRuleResultsData';

const RuleResults = ({ reportTestResult }) => {
  const tableState = useFullTableState();

  // Enable default filter
  const activeFiltersPassed = true;
  const activeFilters = {
    'rule-state': ['failed'],
  };

  const testResultId = reportTestResult.id;
  const reportId = reportTestResult.report_id;

  const {
    data: { ruleResults: ruleResults },
    fetchBatchedRuleResults,
  } = useRuleResultsData({
    testResultId,
    reportId,
    skipRuleResultsBatch: !tableState,
    tableState,
  });

  const rules = useMemo(
    () =>
      ruleResults !== undefined
        ? ruleResults.data.map((rule) => ({
            ...rule,
            profile: { name: reportTestResult.title },
          }))
        : [],
    [ruleResults, reportTestResult]
  );

  const exporter = async () => {
    const result = await fetchBatchedRuleResults();
    return result?.data || [];
  };

  return (
    <RulesTable
      activeFiltersPassed={activeFiltersPassed}
      activeFilters={activeFilters}
      ansibleSupportFilter
      showFailedCounts
      rules={rules}
      columns={columns}
      policyId={reportTestResult.report_id}
      policyName={reportTestResult.title}
      total={ruleResults?.meta?.total}
      defaultTableView="rows"
      onSelect={true}
      remediationsEnabled
      reportTestResult={reportTestResult}
      skipValueDefinitions={true}
      options={{
        exporter,
      }}
      // TODO: provide ruleTree
    />
  );
};

RuleResults.propTypes = {
  hidePassed: propTypes.bool,
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
