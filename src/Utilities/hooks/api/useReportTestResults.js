import useQuery, { apiInstance } from '../useQuery';

export const useReportTestResults = ({ reportId, filter }) => {
  return useQuery(apiInstance.reportTestResults, {
    params: [
      reportId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      filter,
    ],
  });
};
