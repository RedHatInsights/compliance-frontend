import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const usePolicies = (options) => {
  const policiesApi = useComplianceApi('policies');
  const query = useQuery(policiesApi, options);

  return query;
};

export default usePolicies;
