import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({
  systemId,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
}) => [
  systemId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useSystemPolicies = (options) =>
  useComplianceQuery('systemPolicies', { ...options, convertToArray });

export default useSystemPolicies;
