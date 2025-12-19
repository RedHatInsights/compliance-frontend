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

const useReportSystems = (options) =>
  useComplianceQuery('reportSystems', { ...options, convertToArray });

export default useReportSystems;
