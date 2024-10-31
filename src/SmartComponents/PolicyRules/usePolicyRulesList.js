import useComplianceQuery from 'Utilities/hooks/api/useComplianceQuery';

export const usePolicyRulesList = ({
  securityGuideId,
  profileId,
  offset,
  limit,
  options,
}) =>
  useComplianceQuery('profileRules', {
    params: [
      securityGuideId,
      profileId,
      undefined, // xRHIDENTITY
      limit,
      offset,
    ],
    ...options,
  });
