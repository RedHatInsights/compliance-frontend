import { useCallback } from 'react';
import useReportTestResults from '../../Utilities/hooks/api/useReportTestResults';
import useFetchTotalBatched from '../../Utilities/hooks/useFetchTotalBatched';

// Requests GET /reports/{report_id}/test_results/{test_result_id}/rule_results
const useBatchedReportRuleResults = (reportId, testResultId) => {
  const { fetch: fetchReportTestResults } = useReportTestResults({
    skip: true,
  });
  const fetchReportTestResultsBatched = useCallback(
    (offset, limit) =>
      fetchReportTestResults({ reportId, testResultId, limit, offset }, false),
    [fetchReportTestResults, reportId, testResultId]
  );
  const {
    loading: reportTestResultsLoading,
    data: reportTestResults,
    error: reportTestResultsError,
  } = useFetchTotalBatched(fetchReportTestResultsBatched, {
    batchSize: 100,
  });

  return {
    reportTestResults,
    loading: reportTestResultsLoading,
    error: reportTestResultsError,
  };
};

export default useBatchedReportRuleResults;
