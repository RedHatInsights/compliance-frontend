import { useComplianceMutation } from '../useComplianceQuery';

const convertToArray = ({ policyId, tailoringCreate }) => [
  policyId,
  undefined, // xRHIDENTITY
  tailoringCreate,
];

const useCreateTailoring = (options) =>
  useComplianceMutation('createTailoring', { ...options, convertToArray });

export default useCreateTailoring;
