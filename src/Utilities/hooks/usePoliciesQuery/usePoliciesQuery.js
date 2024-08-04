import useQuery, { apiInstance } from 'Utilities/hooks/useQuery';

export const usePoliciesQuery = () => {
  return useQuery(apiInstance.policies, {
    params: [
      {
        limit: 100,
      },
    ],
  });
};
