import useQuery, { apiInstance } from '../useQuery';

const useUpdateTailoring = (policyId, tailoringId, tailoring, options) =>
  useQuery(apiInstance.updateTailoring, {
    params: [policyId, tailoringId, tailoring],
    skip: true,
    ...options,
  });

export default useUpdateTailoring;
