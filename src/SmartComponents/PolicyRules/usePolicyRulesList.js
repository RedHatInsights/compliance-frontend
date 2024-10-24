import useQuery, { apiInstance } from '../../Utilities/hooks/useQuery';

export const usePolicyRulesList = ({
  securityGuideId,
  profileId,
  offset,
  limit,
}) => {
  return useQuery(apiInstance.profileRules, {
    params: [
      securityGuideId,
      profileId,
      undefined, // xRHIDENTITY
      limit, // Limit per request
      offset, // Offset for pagination
    ],
  });
};
