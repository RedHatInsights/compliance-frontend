import { useCallback } from 'react';
import useFetchTotalBatched from '../../Utilities/hooks/useFetchTotalBatched';
import useReportRuleResults from '../../Utilities/hooks/api/useReportRuleResults';

// Requests GET /reports/{report_id}/test_results/{test_result_id}/rule_results
const useBatchedReportRuleResults = (reportId, testResultId) => {
  const { fetch: fetchReportTestResults } = useReportRuleResults({
    skip: true,
  });
  const fetchReportTestResultsBatched = useCallback(
    (offset, limit) =>
      fetchReportTestResults(
        [testResultId, reportId, undefined, limit, offset],
        false
      ),
    [fetchReportTestResults, reportId, testResultId]
  );
  const {
    loading: reportTestResultsLoading,
    data: ruleResults,
    error: reportTestResultsError,
  } = useFetchTotalBatched(fetchReportTestResultsBatched, {
    batchSize: 60, // FIXME: setting to 100 leads to broken requests because of the huge response
  });

  return {
    ruleResults,
    loading: reportTestResultsLoading,
    error: reportTestResultsError,
  };
};

export default useBatchedReportRuleResults;
