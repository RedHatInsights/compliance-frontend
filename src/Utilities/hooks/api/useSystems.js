import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ tags, limit, offset, idsOnly, sortBy, filter }) => [
  undefined, // xRHIDENTITY
  tags,
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
];

const useSystemsQuery = (options) =>
  useComplianceQuery('systems', { ...options, convertToArray });

export default useSystemsQuery;
