import { useApolloClient } from '@apollo/client';
import { GET_SYSTEMS, GET_RULES } from '../constants';
import { prepareForExport } from './helpers';
import usePromiseQueue from 'Utilities/hooks/usePromiseQueue';

const useFetchBatched = () => {
  const { isResolving: isLoading, resolve } = usePromiseQueue();

  return {
    isLoading,
    fetchBatched: (fetchFunction, total, filter, batchSize = 50) => {
      const pages = Math.ceil(total / batchSize) || 1;

      const results = resolve(
        [...new Array(pages)].map(
          (_, pageIdx) => () => fetchFunction(batchSize, pageIdx + 1, filter)
        )
      );

      return results;
    },
  };
};

const useSystemsFetch = ({ id: policyId, totalHostCount } = {}) => {
  const client = useApolloClient();
  const { fetchBatched } = useFetchBatched();

  const fetchFunction = (perPage, page) =>
    client.query({
      query: GET_SYSTEMS,
      fetchResults: true,
      fetchPolicy: 'no-cache',
      variables: {
        perPage,
        page,
        filter: `policy_id = ${policyId}`,
        policyId,
      },
    });

  return async () =>
    (await fetchBatched(fetchFunction, totalHostCount)).flatMap(
      ({
        data: {
          systems: { edges },
        },
      }) => edges.map(({ node }) => node)
    );
};

const useFetchRules = ({ id: policyId } = {}) => {
  const client = useApolloClient();

  const fetchFunction = (perPage = 10, page = 1) =>
    client.query({
      query: GET_RULES,
      fetchResults: true,
      fetchPolicy: 'no-cache',
      variables: {
        perPage,
        page,
        filter: `policy_id = ${policyId}`,
        policyId,
      },
    });

  return async () =>
    (await fetchFunction()).data.profiles?.edges.flatMap(
      (edge) => edge.node.topFailedRules
    );
};

// Hook that provides a wrapper function for a preconfigured GraphQL client to fetch export data
const useQueryExportData = (
  exportSettings,
  policy,
  { onComplete, onError } = {
    onComplete: () => undefined,
    onError: () => undefined,
  }
) => {
  const fetchSystems = useSystemsFetch(policy);
  const fetchRules = useFetchRules(policy);

  return async () => {
    try {
      const systems = await fetchSystems();
      const rules = await fetchRules();
      const exportData = prepareForExport(exportSettings, systems, rules);
      onComplete?.(exportData);
      return exportData;
    } catch (error) {
      if (onError) {
        onError?.(error);
        return [];
      } else {
        throw error;
      }
    }
  };
};

export default useQueryExportData;
