import useQuery, { apiInstance } from '../useQuery';

export const useSecurityGuideRuleTree = (id, options = {}) =>
  useQuery(apiInstance.securityGuideRuleTree, { params: [id], ...options });
