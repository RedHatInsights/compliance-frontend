import useComplianceQuery from './useComplianceQuery';

const useSecurityGuide = (options) =>
  useComplianceQuery('securityGuide', options);

export default useSecurityGuide;
