import { useCallback, useMemo } from 'react';
import useTailoringRules from 'Utilities/hooks/api/useTailoringRules';
import useTailoringRuleTree from 'Utilities/hooks/api/useTailoringRuleTree';

const useTailoringsData = ({
  policy: { id: policyId } = {},
  tailoring: { id: tailoringId } = {},
  tableState: {
    tableState: { view } = {},
    serialisedTableState: { filters, pagination, sort } = {},
  } = {},
  skipRuleTree,
  skipRules,
  groupFilter,
}) => {
  const ruleParams = useMemo(() => {
    return [
      policyId,
      tailoringId,
      undefined,
      // TODO this is a hack: The state value defaults should come from the state itself
      pagination?.limit || 10,
      pagination?.offset || 0,
      undefined,
      sort || 'title:asc',
      ...(filters || groupFilter
        ? [
            filters
              ? `(${filters})${groupFilter ? ` AND (${groupFilter})` : ''}`
              : groupFilter,
          ]
        : []),
      undefined,
    ];
  }, [filters, pagination, groupFilter, sort, policyId, tailoringId]);

  const {
    data: ruleTree,
    loading: ruleTreeLoading,
    error: ruleTreeError,
  } = useTailoringRuleTree({
    params: [policyId, tailoringId],
    skip: skipRuleTree,
  });

  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetch: fetchTailoringRules,
  } = useTailoringRules({
    params: ruleParams,
    skip: skipRules,
  });

  const fetchRules = useCallback(
    async (offset, limit) => {
      const fetchParams = [
        policyId,
        tailoringId,
        ...(view === 'rows'
          ? ruleParams.map((value, idx) => {
              if (idx === 1) {
                return limit;
              }
              if (idx === 2) {
                return offset;
              }
              return value;
            })
          : []),
      ];

      return await fetchTailoringRules(fetchParams, false);
    },
    [view, fetchTailoringRules, policyId, tailoringId, ruleParams]
  );

  const loading = rulesLoading || ruleTreeLoading;
  const error = rulesError || ruleTreeError;

  return {
    error,
    loading,
    data: !loading ? { ruleTree, rules } : { ruleTree: [], rules: [] },
    fetchRules,
  };
};

export default useTailoringsData;
