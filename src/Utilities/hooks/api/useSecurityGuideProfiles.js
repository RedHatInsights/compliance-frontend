import useComplianceQuery from './useComplianceQuery';

const useSecurityGuidesProfiles = (options) =>
  useComplianceQuery('profiles', options);

export default useSecurityGuidesProfiles;
