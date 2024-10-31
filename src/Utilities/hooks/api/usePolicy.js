import useComplianceQuery from './useComplianceQuery';

const usePolicy = (policyId, options) =>
  useComplianceQuery('policy', { params: [policyId], ...options });

export default usePolicy;
