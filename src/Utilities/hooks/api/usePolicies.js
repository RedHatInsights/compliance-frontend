import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ limit, offset, idsOnly, sort, filters }) => [
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const usePolicies = (options) =>
  useTableToolsQuery('policies', { ...options, convertToArray });

export default usePolicies;
