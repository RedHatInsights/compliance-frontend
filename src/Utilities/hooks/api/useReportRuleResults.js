import useTableToolsQuery from '../useTableToolsQuery';

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
  useTableToolsQuery('reportRuleResults', {
    ...options,
    requiredParams: ['testResultId', 'reportId'],
    convertToArray,
  });

export default useReportRuleResults;
