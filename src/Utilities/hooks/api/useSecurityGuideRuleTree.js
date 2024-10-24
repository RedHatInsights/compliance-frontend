import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useSecurityGuideRuleTree = (id, options = {}) => {
  const securityGuideRuleTreeApi = useComplianceApi('securityGuideRuleTree');
  const query = useQuery(securityGuideRuleTreeApi, {
    params: [id],
    ...options,
  });

  return query;
};
export default useSecurityGuideRuleTree;
