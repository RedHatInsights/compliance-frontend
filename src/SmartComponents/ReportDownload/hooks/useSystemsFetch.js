import useReportTestResults from 'Utilities/hooks/api/useReportTestResults';
import useReportSystems from 'Utilities/hooks/api/useReportSystems';

const COMPLIANT_SYSTEMS_FILTER = 'compliant = true and supported = true';
const NON_COMPLIANT_SYSTEMS_FILTER = 'compliant = false and supported = true';
const UNSUPPORTED_SYSTEMS_FILTER = 'supported = false';
const NOT_REPORTING_SYSTEMS_FILTER = 'never_reported = true';

const useSystemsFetch = ({ id: reportId } = {}) => {
  const { fetchBatchedQueue: fetchBatchedTestResultsQueue } =
    useReportTestResults({
      params: {
        reportId,
      },
      skip: true,
    });
  const { fetchBatched: fetchBatchedReportSystems } = useReportSystems({
    params: {
      reportId,
      filter: NOT_REPORTING_SYSTEMS_FILTER,
    },
    skip: true,
  });

  return async () => {
    const testResultsQueue = [
      { filter: COMPLIANT_SYSTEMS_FILTER },
      { filter: NON_COMPLIANT_SYSTEMS_FILTER },
      { filter: UNSUPPORTED_SYSTEMS_FILTER },
    ];
    const testResultsQueueResults = await fetchBatchedTestResultsQueue(
      testResultsQueue
    );
    const neverReportedSystems = await fetchBatchedReportSystems();

    return [...testResultsQueueResults, neverReportedSystems].map(
      ({ data }) => data
    );
  };
};

export default useSystemsFetch;
