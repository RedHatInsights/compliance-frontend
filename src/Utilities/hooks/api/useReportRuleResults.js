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
    convertToArray,
  });

export default useReportRuleResults;
