import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useReportsOS = (options) => {
  const reportsOsApi = useComplianceApi('reportsOS');
  const query = useQuery(reportsOsApi, options);

  return query;
};

export default useReportsOS;
