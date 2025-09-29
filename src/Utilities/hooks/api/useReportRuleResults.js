import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({
  testResultId,
  reportId,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
}) => [
  testResultId,
  reportId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useReportRuleResults = (options) =>
  useComplianceQuery('reportRuleResults', {
    ...options,
    convertToArray,
  });

export default useReportRuleResults;
