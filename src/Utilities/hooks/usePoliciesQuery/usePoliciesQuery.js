import useQuery, { apiInstance } from 'Utilities/hooks/useQuery';

export const usePoliciesQuery = (params) => {
  return useQuery(apiInstance.policies, {
    params: [{ ...params }],
  });
};
