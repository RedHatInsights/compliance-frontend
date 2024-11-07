import { useEffect, useState } from 'react';
import useSystemReports from '../../Utilities/hooks/api/useSystemReports';
import useReportTestResults from '../../Utilities/hooks/api/useReportTestResults';

// custom hook to fetch test results for a system
const useTestResults = (systemId) => {
  const [testResultsLoading, setTestResultsLoading] = useState(true);
  const [testResults, setTestResults] = useState(undefined);
  const { data: reports, loading: reportsLoading } = useSystemReports({
    params: { systemId },
  });
  const { fetch: fetchTestResults } = useReportTestResults({ skip: true });

  useEffect(() => {
    const collectTestResults = async () => {
      const newTestResults = await Promise.all(
        reports.data
          .map(({ id: policyId }) =>
            fetchTestResults(
              {
                params: { reportId: policyId },
                filter: `system_id=${systemId}`,
              },
              false
            )
          )
          .map(({ data }) => data)
      );

      setTestResults(newTestResults);
      setTestResultsLoading(false);
    };

    if (reportsLoading === false && reports !== undefined) {
      setTestResultsLoading(true);
      collectTestResults();
    }
  }, [reports, reportsLoading, fetchTestResults, systemId]);

  return { testResults, testResultsLoading };
};

export default useTestResults;
