import useQuery, { apiInstance } from '../useQuery';

export const useReportTestResults = (id) => {
  return useQuery(apiInstance.reportTestResults, { params: [id] });
};
