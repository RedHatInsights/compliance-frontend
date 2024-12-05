import useComplianceQuery from './useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { policyId, tailoringId } = params;

    return [
      policyId,
      tailoringId,
      undefined, // xRHIDENTITY
    ];
  }
};

const useTailoringRuleTree = (options) =>
  useComplianceQuery('tailoringRuleTree', { ...options, convertToArray });

export default useTailoringRuleTree;
