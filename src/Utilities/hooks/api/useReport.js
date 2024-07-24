import useQuery, { apiInstance } from '../useQuery';

export const useReport = (id) => {
  return useQuery(apiInstance.report, { params: [id] });
};
