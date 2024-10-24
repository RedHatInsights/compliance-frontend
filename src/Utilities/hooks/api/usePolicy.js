import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const usePolicy = (policyId, options) => {
  const policyApi = useComplianceApi('policy');
  const query = useQuery(policyApi, { params: [policyId], ...options });

  return query;
};

export default usePolicy;
