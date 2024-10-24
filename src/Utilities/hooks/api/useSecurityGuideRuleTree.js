import useQuery, { apiInstance } from '../useQuery';

const useSecurityGuideRuleTree = (id, options = {}) =>
  useQuery(apiInstance.securityGuideRuleTree, { params: [id], ...options });

export default useSecurityGuideRuleTree;
