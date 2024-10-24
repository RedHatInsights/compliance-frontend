import useComplianceQuery from './useComplianceQuery';

const useReportTestResults = (options) =>
  useComplianceQuery('reportTestResults', options);

export default useReportTestResults;
