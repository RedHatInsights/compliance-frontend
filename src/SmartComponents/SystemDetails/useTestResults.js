import { useEffect, useState } from 'react';
import useSystemReports from '../../Utilities/hooks/api/useSystemReports';
import useReportTestResults from '../../Utilities/hooks/api/useReportTestResults';

// custom hook to fetch test results for a system
const useTestResults = (systemId) => {
  const [testResultsLoading, setTestResultsLoading] = useState(true);
  const [testResults, setTestResults] = useState(undefined);
  const { data: reports, loading: reportsLoading } = useSystemReports({
    params: [systemId],
  });
  const { fetch: fetchTestResults } = useReportTestResults({ skip: true });

  useEffect(() => {
    const collectTestResults = async () => {
      const newTestResults = await Promise.all(
        reports.data.map(({ id: policyId }) =>
          fetchTestResults(
            [
              policyId,
              undefined,
              100,
              undefined,
              undefined,
              undefined,
              `system_id=${systemId}`,
            ],
            false
          )
        )
      );

      setTestResults(
        newTestResults.flatMap(({ meta, data }, index) =>
          meta.total === 0
            ? []
            : [
                {
                  ...data[0],
                  title: reports.data[index].title,
                  profile_title: reports.data[index].profile_title,
                  report_id: reports.data[index].id,
                },
              ]
        )
      );
      setTestResultsLoading(false);
    };

    if (reportsLoading === false && reports !== undefined) {
      setTestResultsLoading(true);
      collectTestResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports, reportsLoading, systemId]);

  return { testResults, testResultsLoading };
};

export default useTestResults;
