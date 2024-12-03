import useBatchedTailoringRules from './useBatchedTailoringRules';
import useTailoringRuleTree from 'Utilities/hooks/api/useTailoringRuleTree';

const useTailoringsData = ({
  policy: { id: policyId } = {},
  tailoring: { id: tailoringId } = {},
  tableState: {
    tableState: { tableView } = {},
    serialisedTableState: { filters, pagination, sort } = {},
  } = {},
  skipRuleTree,
  skipRules,
  groupFilter,
}) => {
  const ruleParams = {
    policyId,
    tailoringId,
    // TODO this is a hack: The state value defaults should come from the state itself
    limit: pagination?.limit || 10,
    offset: pagination?.offset || 0,
    sortBy: sort || 'title:asc',
    filter:
      filters || groupFilter
        ? [
            filters
              ? `(${filters})${groupFilter ? ` AND (${groupFilter})` : ''}`
              : groupFilter,
          ]
        : undefined,
  };

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
    fetchBatched: fetchBatchedTailoringRules,
  } = useBatchedTailoringRules({
    params: ruleParams,
    skip: skipRules,
    batched: tableView === 'tree',
  });

  const loading =
    tableView === 'tree' ? rulesLoading || ruleTreeLoading : rulesLoading;
  const error = tableView === 'tree' ? rulesError : rulesError || ruleTreeError;
  const data = {
    ...(!skipRuleTree ? { ruleTree } : {}),
    ...(!skipRules ? { rules } : {}),
  };
  return {
    error,
    loading,
    data,
    fetchBatchedTailoringRules,
  };
};

export default useTailoringsData;
