import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ limit, offset, idsOnly, sort, filters }) => [
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useReports = (options) =>
  useTableToolsQuery('reports', { ...options, convertToArray });

export default useReports;
