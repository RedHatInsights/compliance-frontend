import useComplianceQuery from './useComplianceQuery';

const useCreatePolicy = (options) =>
  useComplianceQuery('createPolicy', options);

export default useCreatePolicy;
