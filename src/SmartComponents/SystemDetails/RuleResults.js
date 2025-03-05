import React, { useMemo, useCallback } from 'react';
import RulesTable from '../../PresentationalComponents/RulesTable/RulesTableRest';
import propTypes from 'prop-types';
import TableStateProvider from '../../Frameworks/AsyncTableTools/components/TableStateProvider';
import { useSerialisedTableState } from '../../Frameworks/AsyncTableTools/hooks/useTableState';
import columns from './Columns';
import useReportRuleResults from '../../Utilities/hooks/api/useReportRuleResults';

import useExporter from '@/Frameworks/AsyncTableTools/hooks/useExporter';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const RuleResults = ({ reportTestResult }) => {
  const serialisedTableState = useSerialisedTableState();

  // Enable default filter
  const activeFiltersPassed = true;
  const activeFilters = {
    'rule-state': ['failed'],
  };

  const testResultId = reportTestResult.id;
  const reportId = reportTestResult.report_id;

  const { data: ruleResults, fetch: fetchRuleResults } = useReportRuleResults({
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

  const fetchRules = useCallback(
    async (offset, limit, params) =>
      await fetchRuleResults({ offset, limit, ...params }, false),
    [fetchRuleResults]
  );

  const { fetch: fetchBatched } = useFetchTotalBatched(fetchRules, {
    skip: true,
  });

  const itemIdsInTable = async () =>
    (await fetchBatched({ idsOnly: true })).data.map(({ id }) => id);

  const ruleResultsExporter = useExporter(fetchRules);

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
        exporter: async () =>
          transformRules(await ruleResultsExporter(), reportTestResult),
        itemIdsInTable,
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
