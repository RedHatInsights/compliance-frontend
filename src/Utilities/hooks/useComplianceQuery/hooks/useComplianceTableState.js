import { useDeepCompareMemo } from 'use-deep-compare';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import { paramsWithFilters } from '../helpers';

const useComplianceTableState = (useTableState, paramsOption) => {
  const serialisedTableState = useSerialisedTableState();
  const {
    filters: filterState,
    pagination: { offset, limit } = {},
    sort: sortBy,
  } = serialisedTableState || {};
  const params = useDeepCompareMemo(() => {
    if (!Array.isArray(paramsOption)) {
      const allParams = paramsWithFilters(paramsOption, {
        limit,
        offset,
        sortBy,
        ...(filterState ? { filter: filterState } : {}),
      });

      return useTableState ? allParams : paramsOption;
    } else {
      return paramsOption;
    }
  }, [useTableState, filterState, limit, offset, sortBy, paramsOption]);

  return { params, hasState: !!serialisedTableState };
};

export default useComplianceTableState;
