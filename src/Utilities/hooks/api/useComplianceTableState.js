import { useDeepCompareMemo } from 'use-deep-compare';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';

const useComplianceTableState = (useTableState, paramsOption) => {
  const serialisedTableState = useSerialisedTableState();
  const {
    filters: filterState,
    pagination: { offset, limit } = {},
    sort: sortBy,
  } = serialisedTableState || {};

  const params = useDeepCompareMemo(() => {
    if (!Array.isArray(paramsOption)) {
      const { filter: filterParam, ...paramsParam } = paramsOption || {};

      const filter =
        filterParam && filterState
          ? `(${filterParam}) AND (${filterState})`
          : filterState || filterParam;

      return useTableState
        ? {
            ...paramsParam,
            limit,
            offset,
            sortBy,
            ...(filter ? { filter } : {}),
          }
        : paramsOption;
    } else {
      return paramsOption;
    }
  }, [useTableState, filterState, limit, offset, sortBy, paramsOption]);

  return { params, hasState: !!serialisedTableState };
};

export default useComplianceTableState;
