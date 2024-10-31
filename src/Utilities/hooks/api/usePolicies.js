import useComplianceQuery from './useComplianceQuery';

const usePolicies = (options) => useComplianceQuery('policies', options);

export default usePolicies;
