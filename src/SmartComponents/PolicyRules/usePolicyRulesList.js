import useQuery, { apiInstance } from '../../Utilities/hooks/useQuery';

export const usePolicyRulesList = (security_guide_id, profile_id) => {
  return useQuery(() => {
    return apiInstance.profileRules(security_guide_id, profile_id);
  });
};
 