import useQuery, { apiInstance } from '../../Utilities/hooks/useQuery';

export const useProfileTree = ({ securityGuideId, profileId }) => {
  return useQuery(apiInstance.profileTree, {
    params: [securityGuideId, profileId],
  });
};
