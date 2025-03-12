import useTailoringRules from 'Utilities/hooks/api/useTailoringRules';
import useTailoringRuleTree from 'Utilities/hooks/api/useTailoringRuleTree';

const useTailoringsData = ({
  policy: { id: policyId } = {},
  tailoring: { id: tailoringId } = {},
  tableState: { tableState: { tableView } = {} } = {},
  skipRuleTree,
  skipRules,
  groupFilter,
}) => {
  const {
    data: ruleTree,
    loading: ruleTreeLoading,
    error: ruleTreeError,
  } = useTailoringRuleTree({
    params: { policyId, tailoringId },
    skip: skipRuleTree,
  });

  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetchAllIds,
    exporter,
  } = useTailoringRules({
    params: {
      policyId,
      tailoringId,
      filter: groupFilter,
    },
    skip: skipRules,
    batched: tableView === 'tree',
    useTableState: true,
  });

  return {
    error: rulesLoading || ruleTreeLoading,
    loading: rulesError || ruleTreeError,
    data: {
      ...(!skipRuleTree ? { ruleTree } : {}),
      ...(!skipRules ? { rules } : {}),
    },
    fetchAllIds,
    exporter,
  };
};

export default useTailoringsData;
