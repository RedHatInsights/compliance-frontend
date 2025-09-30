import useComplianceQuery from '../useComplianceQuery';

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
