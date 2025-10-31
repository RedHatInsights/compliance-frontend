import { useCallback, useState } from 'react';
import useReportRuleResults from 'Utilities/hooks/api/useReportRuleResults';
import {
  compileRemediatonData,
  buildFetchQueue,
  isReportTestResultSupported,
} from './helpers';

export const useIssuesFetch = ({
  reportId,
  reportTestResults,
  selectedRuleResultIds,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchBatchedQueue } = useReportRuleResults({
    params: { reportId, filter: 'result=fail' },
    skip: true,
  });

  const fetchIssues = useCallback(async () => {
    setIsLoading(true);

    const testResultsQueue = buildFetchQueue(reportTestResults);
    const ruleRestults = (await fetchBatchedQueue(testResultsQueue)).reduce(
      (allRules, { data }) => [...(allRules || []), ...data],
      [],
    );

    setIsLoading(false);

    return compileRemediatonData(ruleRestults, selectedRuleResultIds);
  }, [fetchBatchedQueue, reportTestResults, selectedRuleResultIds]);

  const canFetch = reportTestResults?.filter(
    (reportTestResult) =>
      isReportTestResultSupported(reportTestResult) &&
      reportTestResult?.rulesFailed > 0,
  ).length;

  return {
    canFetch,
    isLoading,
    fetchIssues,
  };
};

export default useIssuesFetch;
