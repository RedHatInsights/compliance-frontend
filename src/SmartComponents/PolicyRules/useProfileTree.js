import useQuery, { apiInstance } from '../../Utilities/hooks/useQuery';

export const useProfileTree = (security_guide_id, profile_id) => {
  return useQuery(apiInstance.profileTree, {
    params: [
      {
        security_guide_id: security_guide_id,
        profile_id: profile_id,
      },
    ],
  });
};
