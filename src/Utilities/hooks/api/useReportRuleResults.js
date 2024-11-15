import useComplianceQuery from './useComplianceQuery';

const useReportRuleResults = (options) =>
  useComplianceQuery('reportRuleResults', options);

export default useReportRuleResults;
