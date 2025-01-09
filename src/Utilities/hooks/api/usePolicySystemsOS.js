import useComplianceQuery from './useComplianceQuery';

const usePolicySystemsOS = (options) =>
  useComplianceQuery('policySystemsOS', options);

export default usePolicySystemsOS;
