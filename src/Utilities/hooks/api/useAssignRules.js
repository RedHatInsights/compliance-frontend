import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ policyId, tailoringId, assignRulesRequest }) => [
  policyId,
  tailoringId,
  undefined, // xRHIDENTITY,
  assignRulesRequest,
];

const useAssignRules = (options) =>
  useComplianceQuery('assignRules', { ...options, skip: true, convertToArray });

export default useAssignRules;
