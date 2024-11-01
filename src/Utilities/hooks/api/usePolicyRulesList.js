import useComplianceQuery from 'Utilities/hooks/api/useComplianceQuery';

export const usePolicyRulesList = (securityGuideId, profileId, options) =>
  useComplianceQuery('profileRules', {
    params: [securityGuideId, profileId],
    ...options,
  });
