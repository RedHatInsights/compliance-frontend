import useQuery, { apiInstance } from '../useQuery';

const useReport = (reportId) =>
  useQuery(apiInstance.report, { params: [reportId] });

export default useReport;
