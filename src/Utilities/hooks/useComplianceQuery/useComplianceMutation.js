import useComplianceQuery from '../useComplianceQuery';

const useComplianceMutation = (endpoint, options) =>
  useComplianceQuery(endpoint, { ...options, skip: true });

export default useComplianceMutation;
