import { useComplianceQuery, apiInstance } from '../useQuery';

export const useReports = (options) => {
  return useComplianceQuery(apiInstance.reports, options);
};
