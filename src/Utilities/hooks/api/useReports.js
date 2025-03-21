import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ limit, offset, idsOnly, sortBy, filter }) => [
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
];

const useReports = (options) =>
  useComplianceQuery('reports', { ...options, convertToArray });

export default useReports;
