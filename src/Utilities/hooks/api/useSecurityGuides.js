import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ limit, offset, idsOnly, sort, filters }) => [
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useSecurityGuides = (options) =>
  useTableToolsQuery('securityGuides', { ...options, convertToArray });

export default useSecurityGuides;
