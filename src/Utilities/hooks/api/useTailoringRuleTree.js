import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId, tailoringId }) => [
  policyId,
  tailoringId,
  undefined, // xRHIDENTITY
];

const useTailoringRuleTree = (options) =>
  useTableToolsQuery('tailoringRuleTree', { ...options, convertToArray });

export default useTailoringRuleTree;
