import useComplianceQuery from './useComplianceQuery';

const useReport = (reportId, options) =>
  useComplianceQuery('report', { params: [reportId], ...options });

export default useReport;
