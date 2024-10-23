import useQuery, { apiInstance } from '../../Utilities/hooks/useQuery';

export const usePolicyRulesList = (security_guide_id, profile_id) => {
    return useQuery(apiInstance.profileRules, {
        params: [
          {
            security_guide_id: security_guide_id,
            profile_id: profile_id,
          },
        ],
      });
};
 