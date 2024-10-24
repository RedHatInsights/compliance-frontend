import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useSystemReports = (options) => {
  const systemReportsApi = useComplianceApi('systemReports');
  const query = useQuery(systemReportsApi, options);

  return query;
};

export default useSystemReports;
