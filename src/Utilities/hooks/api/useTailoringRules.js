import useQuery, { apiInstance } from '../useQuery';

export const useTailoringRules = (
  policyId,
  tailoringId,
  { params = {}, ...options } = {}
) => {
  const paramsToPass = [policyId, tailoringId, ...params];
  return useQuery(apiInstance.tailoringRules, {
    params: paramsToPass,
    skip: !policyId && !tailoringId,
    ...options,
  });
};
