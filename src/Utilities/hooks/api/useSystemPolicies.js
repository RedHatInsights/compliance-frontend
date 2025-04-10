import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({
  systemId,
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
}) => [
  systemId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
];

const useSystemPolicies = (options) =>
  useComplianceQuery('systemPolicies', { ...options, convertToArray });

export default useSystemPolicies;
