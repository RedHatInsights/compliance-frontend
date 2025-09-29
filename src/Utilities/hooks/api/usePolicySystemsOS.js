import useComplianceQuery from '../useComplianceQuery';

export const convertToArray = ({ policyId, filters }) => [
  policyId,
  undefined, // xRHIDENTITY
  filters,
];

const usePolicySystemsOS = (options) =>
  useComplianceQuery('policySystemsOS', { ...options, convertToArray });

export default usePolicySystemsOS;
