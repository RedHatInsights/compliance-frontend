import useQuery, { apiInstance } from '../useQuery';

export const useReports = () => {
  return useQuery(apiInstance.reports, {
    params: [
      undefined,
      100,
      undefined,
      undefined,
      'with_reported_systems = true',
    ],
  });
};
