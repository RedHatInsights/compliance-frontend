import { useCallback, useMemo, useRef, useState } from 'react';
import { paginationSerialiser } from 'PresentationalComponents/ComplianceTable/serialisers';
import useComplianceQuery from 'Utilities/hooks/api/useComplianceQuery';
import { convertToArray, osApiEndpoints } from './constants';
import {
  buildOSObjects,
  inventoryFiltersSerialiser,
  inventorySortSerialiser,
} from './helpers';

const useSystemsQueries = ({
  apiEndpoint,
  defaultFilter,
  reportId,
  policyId,
  columns,
}) => {
  const osApiEndpoint = osApiEndpoints[apiEndpoint];
  const resultCache = useRef();
  const inventoryFiltersCache = useRef();

  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState();

  const params = useMemo(
    () => ({
      filter: defaultFilter,
      ...(reportId ? { reportId } : {}),
      ...(policyId ? { policyId } : {}),
    }),
    [defaultFilter, reportId, policyId]
  );

  const complianceQueryDefaults = useMemo(
    () => ({
      params,
      skip: true,
      useTableState: true,
    }),
    [params]
  );

  const { fetch, fetchBatched, exporter } = useComplianceQuery(apiEndpoint, {
    ...complianceQueryDefaults,
    convertToArray: convertToArray[apiEndpoint],
  });

  const { fetchBatched: fetchOperatingSystems } = useComplianceQuery(
    osApiEndpoint,
    {
      ...complianceQueryDefaults,
      convertToArray: convertToArray[osApiEndpoint],
    }
  );

  const setIsEmptyState = (result) => {
    // TODO
    //       if (
    //         result.meta.total === 0 &&
    //         activeFilterValues.length === 0 &&
    //         (typeof result?.meta?.tags === 'undefined' ||
    //           result?.meta?.tags?.length === 0)
    //       ) {
    //         setIsEmpty(true);
    //       }
  };

  const fetchSystems = useCallback(
    async ({ sortBy: inventorySortBy, per_page: perPage, page, filters }) => {
      inventoryFiltersCache.current = { filters, sortBy: inventorySortBy };
      const filter = inventoryFiltersSerialiser(filters);
      const sortBy = inventorySortSerialiser(inventorySortBy, columns);

      try {
        const result = await fetch(
          {
            ...paginationSerialiser({ perPage, page }),
            ...(filter ? { filter } : {}),
            ...(sortBy ? { sortBy } : {}),
          },
          false
        );
        resultCache.current = result;

        setIsEmptyState(result);
        setIsLoaded(true);
        setTotal(result?.meta?.total || 0);

        return result;
      } catch (e) {
        setIsLoaded(true);
        setError(e);
      }
    },
    [fetch, columns]
  );

  const fetchSystemsBatched = useCallback(
    async (params) => {
      const { filters, sortBy: inventorySortBy } =
        inventoryFiltersCache?.current || {};
      const filter = inventoryFiltersSerialiser(filters);
      const sortBy = inventorySortSerialiser(inventorySortBy, columns);

      return await fetchBatched({
        ...params,
        filter,
        sortBy,
      });
    },
    [fetchBatched, columns]
  );

  const systemsExporter = useCallback(
    async (params) => {
      const { filters, sortBy: inventorySortBy } =
        inventoryFiltersCache?.current || {};
      const filter = inventoryFiltersSerialiser(filters);
      const sortBy = inventorySortSerialiser(inventorySortBy, columns);

      return await exporter({
        ...params,
        filter,
        sortBy,
      });
    },
    [exporter, columns]
  );

  const fetchOperatingSystemsAsOsObjects = useCallback(
    async (params) => {
      const { filters, sortBy: inventorySortBy } =
        inventoryFiltersCache?.current || {};
      const filter = inventoryFiltersSerialiser(filters);
      const sortBy = inventorySortSerialiser(inventorySortBy, columns);
      const operatingSystems = (
        await fetchOperatingSystems({
          ...params,
          filter,
          sortBy,
        })
      ).data;

      return buildOSObjects(operatingSystems);
    },
    [fetchOperatingSystems, columns]
  );

  return {
    fetchSystems,
    fetchSystemsBatched,
    systemsExporter,
    fetchOperatingSystems: fetchOperatingSystemsAsOsObjects,
    resultCache,
    total,
    isLoaded,
    isEmpty,
    error,
  };
};

export default useSystemsQueries;
