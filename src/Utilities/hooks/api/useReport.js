import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useReport = (reportId, options) => {
  const reportApi = useComplianceApi('report');
  const query = useQuery(reportApi, { params: [reportId], ...options });

  return query;
};

export default useReport;
