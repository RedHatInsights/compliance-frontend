import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ policyId, filter }) => [
  policyId,
  undefined, // xRHIDENTITY
  filter,
];

const usePolicySystemsOS = (options) =>
  useComplianceQuery('policySystemsOS', { ...options, convertToArray });

export default usePolicySystemsOS;
