import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ policy }) => [
  undefined, // xRHIDENTITY
  policy,
];

const useCreatePolicy = (options) =>
  useComplianceQuery('createPolicy', { ...options, convertToArray });

export default useCreatePolicy;
