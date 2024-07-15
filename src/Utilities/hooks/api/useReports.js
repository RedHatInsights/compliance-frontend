import useQuery, { apiInstance } from '../useQuery';

export const useReports = () => {
  return useQuery(apiInstance.reports);
};
