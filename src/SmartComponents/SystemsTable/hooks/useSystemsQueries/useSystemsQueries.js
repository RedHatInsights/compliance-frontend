import { useCallback, useMemo, useRef, useState } from 'react';
import { paginationSerialiser } from 'PresentationalComponents/ComplianceTable/serialisers';
import { useFullTableState } from 'bastilian-tabletools';

import useComplianceQuery from 'Utilities/hooks/useComplianceQuery';
import { convertToArray, osApiEndpoints } from './constants';
import {
  buildOSObjects,
  inventoryFiltersSerialiser,
  inventorySortSerialiser,
  compileResult,
} from './helpers';

const useSystemsQueries = ({
  apiEndpoint,
  defaultFilter,
  reportId,
  policyId,
  columns,
  emptyStateComponent,
  ignoreOsMajorVersion,
} = {}) => {
  const osApiEndpoint = osApiEndpoints[apiEndpoint];
  const resultCache = useRef();
  const inventoryFiltersCache = useRef();
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState();
  const tableState = useFullTableState();
  const { tableState: { selected: selectedIds } = {} } = tableState || {};

  const params = useMemo(
    () => ({
      filter: defaultFilter,
      ...(reportId ? { reportId } : {}),
      ...(policyId ? { policyId } : {}),
    }),
    [defaultFilter, reportId, policyId],
  );

  const complianceQueryDefaults = useMemo(
    () => ({
      params,
      skip: true,
    }),
    [params],
  );

  const { fetch, fetchBatched, exporter } = useComplianceQuery(apiEndpoint, {
    ...complianceQueryDefaults,
    convertToArray: convertToArray[apiEndpoint],
    compileResult,
  });

  const { fetch: fetchOperatingSystems } = useComplianceQuery(osApiEndpoint, {
    ...complianceQueryDefaults,
    convertToArray: convertToArray[osApiEndpoint],
  });

  const setIsEmptyState = useCallback(
    (result) => {
      if (
        emptyStateComponent &&
        result.meta.total === 0 &&
        result.meta.filter === defaultFilter &&
        (typeof result?.meta?.tags === 'undefined' ||
          result?.meta?.tags?.length === 0)
      ) {
        setIsEmpty(true);
      }
    },
    [emptyStateComponent, defaultFilter],
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
      )?.data;

      return buildOSObjects(operatingSystems);
    },
    [fetchOperatingSystems, columns],
  );

  return {
    fetchSystems: fetch,
    fetchSystemsBatched: fetchBatched,
    systemsExporter: exporter,
    fetchOperatingSystems: fetchOperatingSystemsAsOsObjects,
  };
};

export default useSystemsQueries;
