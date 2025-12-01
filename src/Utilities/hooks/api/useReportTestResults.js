import useTableToolsQuery from '../useTableToolsQuery';

export const convertToArray = ({
  reportId,
  tags,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
}) => [
  reportId,
  undefined, // xRHIDENTITY
  tags,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useReportTestResults = (options) =>
  useTableToolsQuery('reportTestResults', {
    ...options,
    requiredParams: 'reportId',
    convertToArray,
  });

export default useReportTestResults;
