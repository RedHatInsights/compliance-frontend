import { useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import usePromiseQueue from 'Utilities/hooks/usePromiseQueue';
import {
  GET_SYSTEMS_ISSUES,
  DEFAULT_SYSTEMS_PER_BATCH,
  DEFAULT_CONNCURRENT_REQUESTS_FOR_ISSUES,
} from './constants';
import { remediationData } from './helpers';

export const useIssuesFetch = (policyId, rules, systems) => {
  const client = useApolloClient();
  const { isResolving, results, resolve } = usePromiseQueue(
    DEFAULT_CONNCURRENT_REQUESTS_FOR_ISSUES
  );

  const fetchFunction = useCallback(
    async (perPage, page) => {
      const systemIds =
        systems.length > 0 ? `id ^ (${systems.join(',')})` : undefined;

      return (
        await client.query({
          query: GET_SYSTEMS_ISSUES,
          fetchPolicy: 'no-cache',
          variables: {
            perPage,
            page,
            filter: `(${systemIds}) AND policy_id = ${policyId}`,
            policyId,
          },
        })
      ).data.systems;
    },
    [systems, policyId]
  );

  const fetch = useCallback(
    async (batchSize = DEFAULT_SYSTEMS_PER_BATCH) => {
      const pages = Math.ceil(systems?.length / batchSize) || 1;
      const results = await resolve(
        [...new Array(pages)].map(
          (_, pageIdx) => () => fetchFunction(batchSize, pageIdx + 1)
        )
      );

      return results && remediationData(results);
    },
    [systems]
  );

  return {
    isLoading: isResolving,
    data: results && remediationData(results),
    fetch,
  };
};
