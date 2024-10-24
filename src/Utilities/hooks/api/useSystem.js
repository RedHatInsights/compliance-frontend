import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useSystem = (systemId, options) => {
  const systemApi = useComplianceApi('system');
  const query = useQuery(systemApi, { params: [systemId], ...options });

  return query;
};

export default useSystem;
