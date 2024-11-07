import useComplianceQuery from './useComplianceQuery';

const useProfileRules = (options) =>
  useComplianceQuery('profileRules', options);

export default useProfileRules;
