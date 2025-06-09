import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import useReportRuleResults from 'Utilities/hooks/api/useReportRuleResults';
import { RulesTable } from 'PresentationalComponents';
import columns from './Columns';

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
    data: ruleResults,
    exporter,
    fetchAllIds,
  } = useReportRuleResults({
    params: {
      testResultId,
      reportId,
    },
    useTableState: true,
    skip: serialisedTableState === undefined,
  });

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
    [ruleResults, reportTestResult]
  );

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
        itemIdsInTable: fetchAllIds,
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
