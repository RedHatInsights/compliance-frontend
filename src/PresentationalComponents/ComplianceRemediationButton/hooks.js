import { useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import usePromiseQueue from 'Utilities/hooks/usePromiseQueue';
import {
  GET_SYSTEMS_ISSUES,
  DEFAULT_SYSTEMS_PER_BATCH,
  DEFAULT_CONNCURRENT_REQUESTS_FOR_ISSUES,
} from './constants';
import { remediationData } from './helpers';
import { apiInstance } from '../../Utilities/hooks/useQuery';
import pAll from 'p-all';

export const useIssuesFetchRest = (reportId, wholeTestResults) => {
  const { isResolving, results, resolve } = usePromiseQueue(
    DEFAULT_CONNCURRENT_REQUESTS_FOR_ISSUES
  );
  const fetch = useCallback(async () => {
    // Keep only supported test results
    let filteredTestResultIds = wholeTestResults
      .filter((tr) => tr.supported)
      .map((tr) => tr.id);

    if (filteredTestResultIds.length === 0) return null;

    // Get rules of all test results
    const results = await resolve(
      [...filteredTestResultIds].map(
        (tr) => () => batchFetch(tr, reportId, 100)
      )
    );

    const hashMap = {};

    results.flat().forEach((res) => {
      // Add each response to hash map
      res.data.data.forEach((rule) => {
        const remediation_issue_id = rule.remediation_issue_id;
        const system_id = rule.system_id;
        const result = rule.result;

        if (!remediation_issue_id || result !== 'fail') return;

        if (!Object.hasOwn(hashMap, remediation_issue_id)) {
          hashMap[remediation_issue_id] = [system_id];
        } else {
          hashMap[remediation_issue_id] = [
            ...hashMap[remediation_issue_id],
            system_id,
          ];
        }
      });
    });

    return hashMap && remediationDataRest(hashMap);
  }, [reportId, wholeTestResults]);

  const remediationDataRest = (hashMap) => ({
    issues: Object.entries(hashMap).map(([remedIssue, systems]) => ({
      id: remedIssue,
      systems: systems,
      description: undefined,
    })),
  });

  const batchFetch = async (testResultId, reportId, limit = 100) => {
    const firstRes = await buildFetch(testResultId, reportId, 0, limit);

    const total = firstRes.data.meta.total || 0;

    const neededRequests = Math.ceil(total / limit) - 1;

    if (neededRequests == 0) {
      return [firstRes];
    }

    const offsets = Array(neededRequests)
      .fill(1)
      .map((_, i) => 100 * i + 100);

    const results = await pAll(
      [...offsets].map(
        (offset) => () => buildFetch(testResultId, reportId, offset, limit)
      ),
      {
        concurrency: 1,
      }
    );

    return [firstRes, ...results];
  };

  const buildFetch = async (testResultId, reportId, offset, limit) =>
    apiInstance.reportRuleResults(testResultId, reportId, null, limit, offset);

  return {
    isLoading: isResolving,
    data: results && remediationDataRest(results),
    fetch,
  };
};

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
