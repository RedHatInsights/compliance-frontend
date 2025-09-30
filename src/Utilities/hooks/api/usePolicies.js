import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ limit, offset, idsOnly, sortBy, filter }) => [
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
];

const usePolicies = (options) =>
  useComplianceQuery('policies', { ...options, convertToArray });

export default usePolicies;
