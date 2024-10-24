import useComplianceQuery from './useComplianceQuery';

const useSecurityGuidesOS = (options) =>
  useComplianceQuery('securityGuidesOS', options);

export default useSecurityGuidesOS;
