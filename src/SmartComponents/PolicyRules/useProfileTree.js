import useQuery, { apiInstance } from '../../Utilities/hooks/useQuery';

export const useProfileTree = (security_guide_id, profile_id) => {
  return useQuery(() => {
    return apiInstance.profileTree(security_guide_id, profile_id);
  });
};
