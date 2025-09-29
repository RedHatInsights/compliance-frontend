import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ limit, offset, idsOnly, sort, filters }) => [
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const usePolicies = (options) =>
  useComplianceQuery('policies', { ...options, convertToArray });

export default usePolicies;
