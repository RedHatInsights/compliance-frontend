import useQuery, { apiInstance } from '../useQuery';

const useUpdateTailoring = (policyId, tailoringId, tailoring, options) =>
  useQuery(apiInstance.updateTailoring, {
    params: [policyId, tailoringId, tailoring],
    ...options,
  });

export default useUpdateTailoring;
