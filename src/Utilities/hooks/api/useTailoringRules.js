import useQuery, { apiInstance } from '../useQuery';

export const useTailoringRules = (
  policyId,
  id,
  { params = [], ...options } = {}
) => {
  const paramsToPass = [policyId, id, ...params];
  return useQuery(apiInstance.tailoringRules, {
    params: paramsToPass,
    ...options,
  });
};
