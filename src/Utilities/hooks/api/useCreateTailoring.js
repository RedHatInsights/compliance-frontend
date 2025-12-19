import { useComplianceMutation } from '../useComplianceQuery';

const convertToArray = ({ policyId, tailoringCreate }) => [
  policyId,
  undefined, // xRHIDENTITY
  tailoringCreate,
];

const useCreatePolicy = (options) =>
  useComplianceMutation('createTailoring', { ...options, convertToArray });

export default useCreatePolicy;
