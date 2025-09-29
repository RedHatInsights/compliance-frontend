import useComplianceQuery from '../useComplianceQuery';

// TODO: rename to sort & filter after using systems table from table-tools
export const convertToArray = ({
  reportId,
  tags,
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
}) => [
  reportId,
  undefined, // xRHIDENTITY
  tags,
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
];

const useReportTestResults = (options) =>
  useComplianceQuery('reportTestResults', { ...options, convertToArray });

export default useReportTestResults;
