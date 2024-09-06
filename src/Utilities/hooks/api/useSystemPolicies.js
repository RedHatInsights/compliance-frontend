import useQuery, { apiInstance } from '../useQuery';

export const useSystemPolicies = (id) => {
  return useQuery(apiInstance.systemPolicies, { params: [id] });
};
