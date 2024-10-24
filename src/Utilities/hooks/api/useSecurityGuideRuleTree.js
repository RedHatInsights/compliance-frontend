import useComplianceQuery from './useComplianceQuery';

const useSecurityGuideRuleTree = (id, options = {}) =>
  useComplianceQuery('securityGuideRuleTree', {
    params: [id],
    ...options,
  });

export default useSecurityGuideRuleTree;
