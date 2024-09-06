import useQuery, { apiInstance } from '../useQuery';

export const useSystemReports = (id) => {
  return useQuery(apiInstance.systemReports, { params: [id] });
};
