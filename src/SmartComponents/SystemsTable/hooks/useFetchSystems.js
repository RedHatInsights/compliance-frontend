import { useCallback } from 'react';

const splitFilter = (filter) => (filter ? filter.split(' and ') : []);

const combineVariablesRest = (standardVariables, allRequestVariables) => {
  const { exclusiveFilter, ...requestVariables } = allRequestVariables || {};

  if (exclusiveFilter) {
    return {
      ...standardVariables,
      ...requestVariables,
      filter: exclusiveFilter,
    };
  }

  const combinedFilter =
    [
      ...splitFilter(standardVariables.filter || ''),
      ...splitFilter(requestVariables.filter || ''),
    ].join(' AND ') || undefined; //We want 'filter: undefined' in case there is not any active filter.

  return {
    ...standardVariables,
    ...requestVariables,
    filter: combinedFilter,
  };
};

export const useFetchSystemsV2 = (
  fetchApi,
  onComplete,
  onError,
  systemFetchArguments = {}
) => {
  const fetchSystems = useCallback(
    async (perPage, page, requestVariables) => {
      const combinedVariables = combineVariablesRest(
        systemFetchArguments,
        requestVariables
      );
      const offset = (page - 1) * perPage;

      try {
        const { data, meta } = await fetchApi(
          offset,
          perPage,
          combinedVariables
        );

        const result = {
          entities: data,
          meta: {
            ...(requestVariables?.tags && { tags: requestVariables.tags }),
            totalCount: meta.total || 0,
          },
        };

        onComplete?.(result, combinedVariables);
        return result;
      } catch (error) {
        console.error('error: ', error.message);
        if (onError) {
          onError(error);
        } else {
          throw error;
        }
      }
    },
    [systemFetchArguments, onComplete, onError, fetchApi]
  );

  return fetchSystems;
};
