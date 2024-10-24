import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useSystemsQuery = (options) => {
  const systemsApi = useComplianceApi('systems');
  const query = useQuery(systemsApi, options);

  return query;
};

export default useSystemsQuery;
