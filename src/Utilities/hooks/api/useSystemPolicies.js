import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useSystemPolicies = (options) => {
  const systemPoliciesApi = useComplianceApi('systemPolicies');
  const query = useQuery(systemPoliciesApi, options);

  return query;
};

export default useSystemPolicies;
