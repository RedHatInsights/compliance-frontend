import React, { useMemo } from 'react';
import RulesTable from '../../PresentationalComponents/RulesTable/RulesTableRest';
import propTypes from 'prop-types';
import TableStateProvider from '../../Frameworks/AsyncTableTools/components/TableStateProvider';
import { useSerialisedTableState } from '../../Frameworks/AsyncTableTools/hooks/useTableState';
import columns from './Columns';
import useRuleResultsData from './hooks/useRuleResultsData';

const RuleResults = ({ reportTestResult }) => {
  const serialisedTableState = useSerialisedTableState();

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
    serialisedTableState,
    skipRules: !serialisedTableState,
  });

  const transformRules = (ruleResults, reportTestResult) => {
    return ruleResults !== undefined
      ? ruleResults.data.map((rule) => ({
          ...rule,
          profile: { name: reportTestResult.title },
        }))
      : [];
  };

  const rules = useMemo(
    () => transformRules(ruleResults, reportTestResult),
    [ruleResults, reportTestResult]
  );

  const exporter = async () => {
    const results = await fetchBatchedRuleResults();
    return transformRules(results, reportTestResult);
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
