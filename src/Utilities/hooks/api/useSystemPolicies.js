import useComplianceQuery from './useComplianceQuery';

const useSystemPolicies = (options) =>
  useComplianceQuery('systemPolicies', options);

export default useSystemPolicies;
