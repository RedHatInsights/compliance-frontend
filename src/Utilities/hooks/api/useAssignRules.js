import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId, tailoringId, assignRulesRequest }) => [
  policyId,
  tailoringId,
  undefined, // xRHIDENTITY,
  assignRulesRequest,
];

const useAssignRules = (options) =>
  useTableToolsQuery('assignRules', { ...options, skip: true, convertToArray });

export default useAssignRules;
