import useQuery, { apiInstance } from '../useQuery';

export const useRule = (securityGuideId, ruleId, options = {}) =>
  useQuery(apiInstance.rule, {
    params: [securityGuideId, ruleId],
    ...options,
  });
