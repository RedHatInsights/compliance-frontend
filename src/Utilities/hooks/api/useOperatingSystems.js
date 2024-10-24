import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useOperatingSystemsQuery = (options) => {
  const systemsOsApi = useComplianceApi('systemsOS');
  const query = useQuery(systemsOsApi, options);

  return query;
};

export default useOperatingSystemsQuery;
