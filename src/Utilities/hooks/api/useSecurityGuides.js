import useComplianceQuery from './useComplianceQuery';

const useSecurityGuides = (options) =>
  useComplianceQuery('securityGuides', options);

export default useSecurityGuides;
