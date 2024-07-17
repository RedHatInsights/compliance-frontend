import useQuery, { apiInstance } from '../useQuery';

export const useReports = (params) => {
  const query = useQuery(apiInstance.reports, params);

  return query;
};
