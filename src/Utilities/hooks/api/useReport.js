import useComplianceQuery from './useComplianceQuery';

// TODO investigate why this endpoint requires direct arguments and does not recognise the params object.
const useReport = (reportId, options) =>
  useComplianceQuery('report', { params: [reportId], ...options });

export default useReport;
