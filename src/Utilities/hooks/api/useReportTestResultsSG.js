import useComplianceQuery from './useComplianceQuery';

const useReportTestResultsSG = (reportId, options) =>
  useComplianceQuery('reportTestResultsSG', { params: [reportId], ...options });

export default useReportTestResultsSG;
