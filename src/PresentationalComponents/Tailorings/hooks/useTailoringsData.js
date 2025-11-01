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
    data: { data: ruleTree } = {},
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
      ...(groupFilter && { filters: groupFilter }),
    },
    skip: skipRules,
    batched: tableView === 'tree',
    useTableState: true,
    useQueryOptions: {
      extraParams: {
        itemIdsInTable: { idsOnly: true },
      },
    },
  });

  return {
    ruleTreeLoading,
    rulesLoading,
    loading: rulesLoading || ruleTreeLoading,
    error: rulesError || ruleTreeError,
    data: {
      ...(!skipRuleTree ? { ruleTree } : {}),
      ...(!skipRules ? { rules } : {}),
    },
    fetchAllIds,
    exporter,
  };
};

export default useTailoringsData;
