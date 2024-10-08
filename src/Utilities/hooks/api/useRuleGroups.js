import useQuery, { apiInstance } from '../useQuery';

export const useRuleGroups = (security_guide_id, options = {}) =>
  useQuery(apiInstance.ruleGroups, {
    params: [security_guide_id],
    ...options,
  });
