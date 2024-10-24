import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useReportTestResults = (options) => {
  const reportTestResultsApi = useComplianceApi('reportTestResults');
  const query = useQuery(reportTestResultsApi, options);

  return query;
};

export default useReportTestResults;
