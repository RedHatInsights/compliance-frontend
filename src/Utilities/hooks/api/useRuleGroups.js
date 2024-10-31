import useComplianceQuery from './useComplianceQuery';

const useRuleGroups = (options) => useComplianceQuery('ruleGroups', options);

export default useRuleGroups;
