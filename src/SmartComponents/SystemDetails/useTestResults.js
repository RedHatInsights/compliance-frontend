import { useEffect, useState } from 'react';
import useSystemReports from '../../Utilities/hooks/api/useSystemReports';
import useReportTestResults from '../../Utilities/hooks/api/useReportTestResults';

// custom hook to fetch test results for a system
const useTestResults = (systemId) => {
  const [testResultsLoading, setTestResultsLoading] = useState(true);
  const [testResults, setTestResults] = useState(undefined);
  const { data: { data: reports } = {}, loading: reportsLoading } =
    useSystemReports({
      params: { systemId },
    });
  const { fetchBatchedQueue: fetchReportTestResults } = useReportTestResults({
    skip: true,
  });

  useEffect(() => {
    const collectTestResults = async () => {
      const filter = `system_id=${systemId}`;
      const fetchQueue = reports.map(({ id: reportId }) => ({
        reportId,
        filter,
      }));
      const fetchQueueResults = (await fetchReportTestResults(fetchQueue))
        .map(({ meta, data }) => {
          const report = reports.find(({ id }) => id === meta.reportId);
          return (
            meta.total > 0 && {
              ...data[0],
              title: report.title,
              profile_title: report.profile_title,
              report_id: report.id,
            }
          );
        })
        .filter((v) => !!v);

      setTestResults(fetchQueueResults);
      setTestResultsLoading(false);
    };

    if (reportsLoading === false && reports !== undefined) {
      setTestResultsLoading(true);
      collectTestResults();
    }
  }, [reports, reportsLoading, systemId, fetchReportTestResults]);

  return { testResults, testResultsLoading };
};

export default useTestResults;
