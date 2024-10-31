import useComplianceQuery from 'Utilities/hooks/api/useComplianceQuery';

export const useProfileTree = ({ securityGuideId, profileId, options }) =>
  useComplianceQuery('profileTree', {
    params: [securityGuideId, profileId],
    ...options,
  });
