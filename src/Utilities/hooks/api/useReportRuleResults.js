import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({
  testResultId,
  reportId,
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
}) => [
  testResultId,
  reportId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
];

const useReportRuleResults = (options) =>
  useComplianceQuery('reportRuleResults', {
    ...options,
    convertToArray,
  });

export default useReportRuleResults;
