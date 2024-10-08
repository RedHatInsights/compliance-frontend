import useQuery, { apiInstance } from '../useQuery';

export const useSystem = (id) => {
  return useQuery(apiInstance.system, { params: [id] });
};
