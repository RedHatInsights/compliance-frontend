import useQuery, { apiInstance } from '../useQuery';

const useRuleGroups = (security_guide_id, options = {}) =>
  useQuery(apiInstance.ruleGroups, {
    params: [security_guide_id],
    ...options,
  });

export default useRuleGroups;
