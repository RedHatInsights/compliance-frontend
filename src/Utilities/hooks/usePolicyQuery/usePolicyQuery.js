import { useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { logMultipleErrors } from 'Utilities/helpers';
import {
  POLICY_QUERY,
  POLICY_QUERY_MINIMAL,
  POLICY_RULE_TREES_QUERY,
  POLICY_VALUE_DEFINITONS_QUERY,
} from './constants';
import { compileData } from './helpers';

const usePolicyQuery = ({ policyId, skip: skipCondition, minimal }) => {
  const skip = policyId === 'new' || skipCondition;

  const {
    data: policyData,
    error: policyError,
    loading: policyLoading,
    refetch: refecthPolicy,
  } = useQuery(minimal ? POLICY_QUERY_MINIMAL : POLICY_QUERY, {
    variables: { policyId },
    skip,
    fetchPolicy: 'no-cache',
  });

  const {
    data: ruleTreesData,
    error: ruleTreesError,
    loading: ruleTreesLoading,
    refetch: refecthRuleTrees,
  } = useQuery(POLICY_RULE_TREES_QUERY, {
    variables: { policyId },
    skip: minimal || skip,
    fetchPolicy: 'no-cache',
  });

  const {
    data: valueDefinitionsData,
    error: valueDefinitionsError,
    loading: valueDefinitionsLoading,
    refetch: refecthValueDefinitions,
  } = useQuery(POLICY_VALUE_DEFINITONS_QUERY, {
    variables: { policyId },
    skip: minimal || skip,
    fetchPolicy: 'no-cache',
  });

  const data = useMemo(
    () => compileData(policyData, ruleTreesData, valueDefinitionsData),
    [policyData, ruleTreesData, valueDefinitionsData]
  );

  const error = useMemo(
    () => logMultipleErrors(policyError, ruleTreesError, valueDefinitionsError),
    [policyError, ruleTreesError, valueDefinitionsError]
  );

  const loading = policyLoading || ruleTreesLoading || valueDefinitionsLoading;

  const refetch = useCallback(() => {
    if (!skip) {
      refecthPolicy();
      refecthRuleTrees();
      refecthValueDefinitions();
    }
  }, [refecthPolicy, refecthRuleTrees, refecthValueDefinitions]);

  return policyId === 'new'
    ? { data: true, refetch: () => {} }
    : {
        data,
        error,
        loading,
        refetch,
      };
};

export default usePolicyQuery;
