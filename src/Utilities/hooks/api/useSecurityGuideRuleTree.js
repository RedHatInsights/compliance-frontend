import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { securityGuideId } = params;

    return [
      securityGuideId,
      undefined, // xRHIDENTITY
    ];
  }
};

const useSecurityGuideRuleTree = (options = {}) =>
  useComplianceQuery('securityGuideRuleTree', {
    ...options,
    convertToArray,
  });

export default useSecurityGuideRuleTree;
