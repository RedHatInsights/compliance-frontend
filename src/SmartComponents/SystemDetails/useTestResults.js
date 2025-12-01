import { useEffect, useState } from 'react';
import useSystemReports from 'Utilities/hooks/api/useSystemReports';
import useReportTestResults from 'Utilities/hooks/api/useReportTestResults';

// custom hook to fetch test results for a system
const useTestResults = (systemId, { skip = false } = {}) => {
  const [testResultsLoading, setTestResultsLoading] = useState(true);
  const [testResults, setTestResults] = useState();
  const { data: { data: reports } = {}, loading: reportsLoading } =
    useSystemReports({
      params: { systemId },
      skip: skip,
    });
  const { fetchQueue: fetchReportTestResults } = useReportTestResults({
    skip: true,
  });

  useEffect(() => {
    const collectTestResults = async () => {
      const filters = `system_id=${systemId}`;
      const fetchQueue = reports.map(({ id: reportId }) => ({
        reportId,
        filters,
      }));
      const fetchQueueResults = (await fetchReportTestResults(fetchQueue))
        .map(({ meta, data }) => {
          const {
            title,
            profile_title,
            id: report_id,
          } = reports.find(({ id }) => id === meta.reportId);
          return (
            meta.total > 0 && {
              ...data[0],
              title,
              profile_title,
              report_id,
            }
          );
        })
        .filter((v) => !!v);

      setTestResults(fetchQueueResults);
      setTestResultsLoading(false);
    };

    // TODO Questionable. revisit when reworking to using useQuery's queue fetching
    if (reportsLoading === false && reports !== undefined) {
      setTestResultsLoading(true);
      collectTestResults();
    }
  }, [reports, reportsLoading, systemId, fetchReportTestResults]);

  return { testResults, testResultsLoading };
};

export default useTestResults;
