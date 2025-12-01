import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId, tailoringId }) => [
  policyId,
  tailoringId,
  undefined, // xRHIDENTITY
];

const useTailoringRuleTree = (options) =>
  useTableToolsQuery('tailoringRuleTree', {
    ...options,
    requiredParams: ['policyId', 'tailoringId'],
    convertToArray,
  });

export default useTailoringRuleTree;
