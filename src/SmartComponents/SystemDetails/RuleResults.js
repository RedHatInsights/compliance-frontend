import React, { useMemo } from 'react';
import RulesTable from '../../PresentationalComponents/RulesTable/RulesTableRest';
import propTypes from 'prop-types';
import TableStateProvider from '../../Frameworks/AsyncTableTools/components/TableStateProvider';
import useReportRuleResults from '../../Utilities/hooks/api/useReportRuleResults';
import { useSerialisedTableState } from '../../Frameworks/AsyncTableTools/hooks/useTableState';
import columns from './Columns';

const RuleResults = ({ hidePassed, reportTestResult }) => {
  const serialisedTableState = useSerialisedTableState();

  const { limit, offset } = serialisedTableState?.pagination || {};
  const filters = serialisedTableState?.filters;
  const sort = serialisedTableState?.sort;

  const { data: ruleResults } = useReportRuleResults({
    params: [
      reportTestResult.id,
      reportTestResult.report_id,
      undefined,
      limit,
      offset,
      false,
      sort,
      filters,
    ],
    skip: serialisedTableState === undefined,
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

  return (
    <RulesTable
      ansibleSupportFilter
      hidePassed={false} // TODO: fix this
      showFailedCounts
      rules={rules}
      columns={columns}
      policyId={reportTestResult.report_id}
      policyName={reportTestResult.title}
      total={ruleResults?.meta?.total}
      defaultTableView="rows"
      enableSelect
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
