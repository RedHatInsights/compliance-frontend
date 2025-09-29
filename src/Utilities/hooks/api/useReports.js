import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ limit, offset, idsOnly, sort, filters }) => [
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useReports = (options) =>
  useComplianceQuery('reports', { ...options, convertToArray });

export default useReports;
