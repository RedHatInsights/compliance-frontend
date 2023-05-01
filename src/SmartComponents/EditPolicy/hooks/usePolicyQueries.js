import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { MULTIVERSION_QUERY, RULE_VALUE_DEFINITIONS_QUERY } from '../constants';

const appendBenchmark = (profileWithValueDefinitions) => (profile) => ({
  ...profile,
  benchmark: {
    ...profile.benchmark,
    ...profileWithValueDefinitions.profile.policy.profiles.find(
      ({ id }) => profile.id === id
    ).benchmark,
  },
});

const mergeQueries = (profileData, profileWithValueDefinitions) => {
  const appendBenchmarkFunction = appendBenchmark(profileWithValueDefinitions);

  return {
    ...profileData?.profile,
    policy: {
      ...profileData.profile.policy,
      profiles: profileData.profile.policy?.profiles?.map(
        appendBenchmarkFunction
      ),
    },
  };
};

const usePolicyQueries = () => {
  const { policy_id: policyId } = useParams();
  const { data, loading, error } = useQuery(MULTIVERSION_QUERY, {
    variables: { policyId },
  });
  const {
    data: ruleValueDefinitionsData,
    loading: ruleValueDefinitionsLoading,
    error: ruleValueDefinitionsError,
  } = useQuery(RULE_VALUE_DEFINITIONS_QUERY, {
    variables: { policyId },
  });

  const policy = useMemo(
    () =>
      data?.profile && ruleValueDefinitionsData?.profile
        ? mergeQueries(data, ruleValueDefinitionsData)
        : undefined,
    [data, ruleValueDefinitionsData]
  );

  return {
    policy,
    loading: loading && ruleValueDefinitionsLoading,
    error: error || ruleValueDefinitionsError,
  };
};

export default usePolicyQueries;
