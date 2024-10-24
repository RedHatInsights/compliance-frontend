import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useReports = (options) => {
  const reportsApi = useComplianceApi('reports');
  const query = useQuery(reportsApi, options);

  return query;
};

export default useReports;
