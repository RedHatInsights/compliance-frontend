import useComplianceQuery from './useComplianceQuery';

const useTailoringRuleTree = (options) =>
  useComplianceQuery('tailoringRuleTree', options);

export default useTailoringRuleTree;
