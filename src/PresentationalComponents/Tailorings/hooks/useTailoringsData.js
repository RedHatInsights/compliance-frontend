import { useCallback } from 'react';
import { useSecurityGuideRuleTree } from 'Utilities/hooks/api/useSecurityGuideRuleTree';
import { useTailoringRules } from 'Utilities/hooks/api/useTailoringRules';
import { useRuleGroups } from 'Utilities/hooks/api/useRuleGroups';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';
import { buildTreeTable } from '../helpers';

const shouldSkip = (request, { view }) =>
  ({
    ruleTree: view !== 'tree',
    ruleGroups: view !== 'tree',
    rules: false,
  }[request]);

const useTailoringsData = (
  { id: policyId } = {},
  { id: tailoringId, security_guide_id } = {},
  {
    tableState = {},
    serialisedTableState: { filters, pagination, sort } = {},
  } = {}
) => {
  const {
    data: ruleTree,
    loading: ruleTreeLoading,
    error: ruleTreeError,
  } = useSecurityGuideRuleTree(security_guide_id, {
    skip: shouldSkip('ruleTree', tableState),
  });
  const { fetch: fetchRuleGroups } = useRuleGroups(security_guide_id, {
    skip: true,
    debounced: false,
  });

  const fetchRuleGroupsForBatch = useCallback(
    (offset, limit) =>
      fetchRuleGroups([security_guide_id, undefined, limit, offset]),
    [fetchRuleGroups, security_guide_id]
  );

  const { loading: ruleGroupsLoading, data: ruleGroups } = useFetchTotalBatched(
    fetchRuleGroupsForBatch,
    { batchSize: 60, skip: shouldSkip('ruleGroups', tableState) }
  );
  const openRuleGroups = tableState?.['open-items']?.filter((itemId) =>
    ruleGroups?.map(({ id }) => id).includes(itemId)
  );
  const groupFilter =
    openRuleGroups?.length > 0
      ? `rule_group_id ^ (${openRuleGroups.map((id) => `"${id}"`).join(',')})`
      : undefined;

  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
  } = useTailoringRules(policyId, tailoringId, {
    params: [
      undefined,
      // TODO this is a hack: The state value defaults should come from the state itself
      pagination?.limit || 10,
      pagination?.offset || 0,
      sort || 'title:asc',
      ...(filters || groupFilter
        ? [
            filters
              ? `(${filters})${groupFilter ? ` AND (${groupFilter})` : ''}`
              : groupFilter,
          ]
        : []),
      undefined,
    ],
    skip: shouldSkip('rules', tableState),
  });

  const loading = ruleTreeLoading && rulesLoading && ruleGroupsLoading;
  const error = !!ruleTreeError && !!rulesError;

  const namedRuleTree = ruleGroups
    ? buildTreeTable(ruleTree, ruleGroups)
    : undefined;

  return {
    error,
    loading,
    data: !loading ? { ruleTree: namedRuleTree, rules, ruleGroups } : {},
  };
};

export default useTailoringsData;
