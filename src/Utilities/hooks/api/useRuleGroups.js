import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useRuleGroups = (options) => {
  const ruleGroupsApi = useComplianceApi('ruleGroups');
  const query = useQuery(ruleGroupsApi, options);

  return query;
};

export default useRuleGroups;
