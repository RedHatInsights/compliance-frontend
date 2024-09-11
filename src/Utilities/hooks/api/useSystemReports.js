import useQuery, { apiInstance } from '../useQuery';

export const useSystemReports = ({ systemId, limit = 10 }) => {
  return useQuery(apiInstance.systemReports, {
    params: [systemId, undefined, limit],
  });
};
