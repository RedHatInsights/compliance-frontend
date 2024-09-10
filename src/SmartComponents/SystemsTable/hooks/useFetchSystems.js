import { useApolloClient } from '@apollo/client';
import { systemsWithRuleObjectsFailed } from 'Utilities/ruleHelpers';
import { useCallback } from 'react';

const renameInventoryAttributes = ({
  culledTimestamp,
  staleWarningTimestamp,
  staleTimestamp,
  insightsId,
  ...system
}) => ({
  ...system,
  insights_id: insightsId,
  culled_timestamp: culledTimestamp,
  stale_warning_timestamp: staleWarningTimestamp,
  stale_timestamp: staleTimestamp,
});

const combineVariables = (standardVariables, allRequestVariables) => {
  const { exclusiveFilter, ...requestVariables } = allRequestVariables || {};

  if (exclusiveFilter) {
    return {
      ...standardVariables,
      ...requestVariables,
      filter: exclusiveFilter,
    };
  }

  if (!!requestVariables && typeof requestVariables?.filter === 'string') {
    const combinedFilter = [
      ...standardVariables.filter.split(' and '),
      ...requestVariables.filter.split(' and '),
    ].join(' and ');

    return {
      ...standardVariables,
      ...requestVariables,
      filter: combinedFilter,
    };
  }

  if (standardVariables || requestVariables) {
    return {
      ...standardVariables,
      ...requestVariables,
    };
  }
};

export const useFetchSystems = ({ query, onComplete, variables, onError }) => {
  const client = useApolloClient();

  return (perPage, page, requestVariables) => {
    const combinedVariables = combineVariables(variables, requestVariables);

    console.log('debug systems: ', perPage, page, requestVariables, query);
    return client
      .query({
        query,
        fetchResults: true,
        fetchPolicy: 'no-cache',
        variables: {
          perPage,
          page,
          ...(combinedVariables ? combinedVariables : {}),
        },
      })
      .then(({ data }) => {
        const systems = data?.systems?.edges?.map((e) => e.node) || [];
        const entities = systemsWithRuleObjectsFailed(systems).map(
          renameInventoryAttributes
        );
        const result = {
          entities,
          meta: {
            ...(requestVariables?.tags && { tags: requestVariables.tags }),
            totalCount: data?.systems?.totalCount || 0,
          },
        };

        onComplete && onComplete(result);
        return result;
      })
      .catch((error) => {
        if (onError) {
          onError(error);
          return { entities: [], meta: { totalCount: 0 } };
        } else {
          throw error;
        }
      });
  };
};

export const useFetchSystemsV2 = ({
  fetchApi,
  onComplete,
  onError,
  systemFetchArguments = {},
}) => {
  return useCallback(
    async (perPage, page, requestVariables) => {
      const combinedVariables = combineVariables(
        systemFetchArguments,
        requestVariables
      );

      try {
        const { data, meta } = await fetchApi(page, perPage, combinedVariables);

        const serialisedData = {
          entities: data,
          meta: {
            ...(requestVariables?.tags && { tags: requestVariables.tags }),
            totalCount: meta.total || 0,
          },
        };

        onComplete && onComplete(serialisedData);
        return serialisedData;
      } catch (error) {
        if (onError) {
          onError(error);
          return { entities: [], meta: { totalCount: 0 } };
        } else {
          throw error;
        }
      }
    },
    [systemFetchArguments]
  );
};
