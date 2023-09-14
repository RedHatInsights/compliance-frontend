import { useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { logMultipleErrors } from 'Utilities/helpers';
import {
  BENCHMARKS_QUERY,
  BENCHMARKS_RULES_TREES_QUERY,
  BENCHMARKS_VALUE_DEFINITIONS_QUERY,
} from '../constants';

const compileData = (benchmarksData, ruleTreesData, valueDefinitionsData) => ({
  benchmarks: {
    nodes: benchmarksData?.benchmarks.nodes.map((node) => {
      const ruleTree = ruleTreesData?.benchmarks.nodes.find(
        ({ id }) => id === node.id
      )?.ruleTree;
      const valueDefinitions = valueDefinitionsData?.benchmarks.nodes.find(
        ({ id }) => id === node.id
      )?.valueDefinitions;

      return {
        ...node,
        ruleTree,
        valueDefinitions,
      };
    }),
  },
});

const useBenchmarksQuery = ({ osMajorVersion, osMinorVersions }) => {
  const filter =
    `os_major_version = ${osMajorVersion} ` +
    `and latest_supported_os_minor_version ^ "${osMinorVersions.join(',')}"`;

  const {
    data: benchmarksData,
    error: benchmarksError,
    loading: benchmarksLoading,
    refetch: refetchProfiles,
  } = useQuery(BENCHMARKS_QUERY, {
    variables: {
      filter,
    },
    skip: osMinorVersions.length === 0,
    fetchPolicy: 'no-cache',
  });

  const {
    data: ruleTreesData,
    error: ruleTreesError,
    loading: ruleTreesLoading,
    refetch: refecthRuleTrees,
  } = useQuery(BENCHMARKS_RULES_TREES_QUERY, {
    variables: { filter },
    skip: osMinorVersions.length === 0,
    fetchPolicy: 'no-cache',
  });

  const {
    data: valueDefinitionsData,
    error: valueDefinitionsError,
    loading: valueDefinitionsLoading,
    refetch: refecthValueDefinitions,
  } = useQuery(BENCHMARKS_VALUE_DEFINITIONS_QUERY, {
    variables: { filter },
    skip: osMinorVersions.length === 0,
    fetchPolicy: 'no-cache',
  });

  const data = useMemo(
    () => compileData(benchmarksData, ruleTreesData, valueDefinitionsData),
    [benchmarksData, ruleTreesData, valueDefinitionsData]
  );

  const error = useMemo(
    () =>
      logMultipleErrors(benchmarksError, ruleTreesError, valueDefinitionsError),
    [benchmarksError, ruleTreesError, valueDefinitionsError]
  );

  const loading =
    benchmarksLoading || ruleTreesLoading || valueDefinitionsLoading;

  const refetch = useCallback(() => {
    refetchProfiles();
    refecthRuleTrees();
    refecthValueDefinitions();
  }, [refetchProfiles, refecthRuleTrees, refecthValueDefinitions]);

  return {
    data,
    error,
    loading,
    refetch,
  };
};

export default useBenchmarksQuery;
