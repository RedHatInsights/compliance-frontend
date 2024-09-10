import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { Spinner } from '@patternfly/react-core';
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';
import { osMinorVersionFilter, GET_SYSTEMS_OSES } from './constants';
import useExport from 'Utilities/hooks/useTableTools/useExport';
import { useBulkSelect } from 'Utilities/hooks/useTableTools/useBulkSelect';
import { dispatchNotification } from 'Utilities/Dispatcher';
import usePromiseQueue from 'Utilities/hooks/usePromiseQueue';
import { setDisabledSelection } from '../../store/Actions/SystemActions';
import { useFetchSystems, useFetchSystemsV2 } from './hooks/useFetchSystems';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';

const groupByMajorVersion = (versions = [], showFilter = []) => {
  const showVersion = (version) => {
    if (showFilter.length > 0) {
      return showFilter.map(String).includes(String(version));
    } else {
      return true;
    }
  };

  return versions.reduce((acc, currentValue) => {
    if (showVersion(currentValue.major)) {
      acc[String(currentValue.major)] = [
        ...new Set([...(acc[currentValue.major] || []), currentValue.minor]),
      ];
    }

    return acc;
  }, []);
};

export const useOsMinorVersionFilter = (showFilter, fetchArguments = {}) => {
  let { data } = useQuery(GET_SYSTEMS_OSES, {
    skip: !showFilter,
    ...fetchArguments,
  });
  const { osVersions } = data?.systems || {};

  return showFilter
    ? osMinorVersionFilter(groupByMajorVersion(osVersions, showFilter))
    : [];
};

export const useSystemsFilter = (
  filterString,
  showOnlySystemsWithTestResults,
  defaultFilter
) => {
  const combindedFilter = [
    ...(showOnlySystemsWithTestResults ? ['has_test_results = true'] : []),
    ...(filterString?.length > 0 ? [filterString] : []),
  ].join(' and ');
  const filter = defaultFilter
    ? `(${defaultFilter})` +
      (combindedFilter ? ` and (${combindedFilter})` : '')
    : combindedFilter;

  return filter;
};

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

const buildApiFilters = (filters = {}) => {
  const { tagFilters, hostGroupFilter, ...otherFilters } = filters;
  const tagsApiFilter = tagFilters
    ? {
        tags: tagFilters.flatMap((tagFilter) =>
          tagFilter.values.map(
            (tag) =>
              `${encodeURIComponent(tagFilter.key)}/${encodeURIComponent(
                tag.tagKey
              )}=${encodeURIComponent(tag.value)}`
          )
        ),
      }
    : {};

  /**
   * TODO: build a separate layer/hook that integrates inventory filters with gq filter
   */

  // filtering by group_name is enabled in gq filter
  if (hostGroupFilter !== undefined && Array.isArray(hostGroupFilter)) {
    otherFilters.filter = `(${hostGroupFilter
      .map((value) => `group_name = "${value}"`)
      .join(' or ')})`;
  }

  return {
    ...otherFilters,
    ...tagsApiFilter,
  };
};

export const useGetEntities = (fetchEntities, { selected, columns } = {}) => {
  const appendDirection = (attributes, direction) =>
    attributes.map((attribute) => `${attribute}:${direction}`);

  const findColumnByKey = (sortKey) =>
    (columns || []).find(
      (column) =>
        column.key === sortKey || // group column has a sort key different to its main key
        (column.key === 'groups' && sortKey === 'group_name')
    );

  return async (
    _ids,
    { page = 1, per_page: perPage, orderBy, orderDirection, filters }
  ) => {
    const sortableColumn = findColumnByKey(orderBy);
    const sortBy =
      sortableColumn && sortableColumn.sortBy
        ? appendDirection(sortableColumn.sortBy, orderDirection)
        : undefined;
    const filterForApi = buildApiFilters(filters);

    const fetchedEntities = await fetchEntities(perPage, page, {
      ...filterForApi,
      sortBy,
    });

    console.log(fetchedEntities, 'debug fetched entities');
    const {
      entities,
      meta: { totalCount },
    } = fetchedEntities || {};

    return {
      results: entities.map((entity) => ({
        ...entity,
        selected: (selected || []).map((id) => id).includes(entity.id),
      })),
      orderBy,
      orderDirection,
      total: totalCount,
    };
  };
};

// This hook is primarily meant to work around issues in the inventory
export const useInventoryUtilities = (
  inventory,
  selectedSystems,
  activeFilters
) => {
  const dispatch = useDispatch();

  // Resets the Inventory to a loading state
  // and prevents previously shown columns and rows to appear
  useLayoutEffect(() => {
    dispatch({
      type: 'INVENTORY_INIT',
    });
  }, []);

  // Ensures rows are marked as selected
  useEffect(() => {
    dispatch({
      type: 'SELECT_ENTITIES',
      payload: {
        selected: selectedSystems,
      },
    });
  }, [selectedSystems]);

  // Filters do not yet trigger the inventory to call getEntities
  // and the page would not reset to page 1
  const resetPage = () => {
    Promise.resolve(
      dispatch({
        type: 'RESET_PAGE',
      })
    ).then(() => inventory?.current?.onRefreshData());
  };

  // The debounce is to not have filter updates collide or get out of order.
  const debounceResetPage = debounce(resetPage, 50);

  useEffect(() => {
    debounceResetPage();
  }, [activeFilters]);
};

const toIdFilter = (ids) =>
  ids?.length > 0 ? `id ^ (${ids.join(',')})` : undefined;

export const useSystemsExport = ({
  columns,
  selected,
  total,
  fetchArguments = {},
  dataMap,
}) => {
  const { isLoading, fetchBatched } = useFetchBatched();
  const apiV2Enabled = useAPIV2FeatureFlag();
  const selectionFilter = selected ? toIdFilter(selected) : undefined;
  const fetchSystemsGraphQL = useFetchSystems({
    query: fetchArguments.query,
    variables: {
      ...fetchArguments?.variables,
      ...(fetchArguments.tags && { tags: fetchArguments.tags }),
      filter: selectionFilter
        ? `${fetchArguments.variables?.filter} and (${selectionFilter})`
        : fetchArguments.variables?.filter,
    },
    onError: () => {
      dispatchNotification({
        variant: 'danger',
        title: 'Couldn’t download export',
        description: 'Reinitiate this export to try again.',
      });
    },
  });

  const fetchSystemsRest = useFetchSystemsV2({
    dataMap,
    systemFetchArguments: {
      ...fetchArguments?.variables,
      ...(fetchArguments.tags && { tags: fetchArguments.tags }),
      filter: selectionFilter
        ? `${fetchArguments.filter} and (${selectionFilter})`
        : fetchArguments?.filter,
    },
    onError: () => {
      dispatchNotification({
        variant: 'danger',
        title: 'Couldn’t download export',
        description: 'Reinitiate this export to try again.',
      });
    },
  });

  const selectedFilter = () =>
    selected?.length > 0 ? toIdFilter(selected) : undefined;

  const exporter = async () => {
    const fetchedItems = await fetchBatched(
      apiV2Enabled ? fetchSystemsRest : fetchSystemsGraphQL,
      total,
      selectedFilter()
    );

    return fetchedItems.flatMap((result) => result.entities);
  };

  const {
    toolbarProps: { exportConfig },
  } = useExport({
    exporter,
    columns,
    isDisabled: total === 0 || isLoading,
    onStart: () => {
      dispatchNotification({
        variant: 'info',
        title: 'Preparing export',
        description: 'Once complete, your download will start automatically.',
      });
    },
    onComplete: () => {
      dispatchNotification({
        variant: 'success',
        title: 'Downloading export',
      });
    },
  });

  return exportConfig;
};

export const useSystemBulkSelect = ({
  total,
  onSelect,
  preselected,
  fetchArguments,
  currentPageIds,
  dataMap,
}) => {
  const dispatch = useDispatch();
  const { isLoading, fetchBatched } = useFetchBatched();
  const apiV2Enabled = useAPIV2FeatureFlag();
  // This is meant as a compatibility layer and to be removed
  const [selectedSystems, setSelectedSystems] = useState([]);
  const fetchSystemsGraphQL = useFetchSystems({
    ...fetchArguments,
    onError: (error) => {
      dispatchNotification({
        variant: 'danger',
        title: 'Error selecting systems',
        description: error.message,
      });
    },
  });

  const fetchSystemsRest = useFetchSystemsV2({
    dataMap,
    systemFetchArguments: fetchArguments,
    onError: () => {
      dispatchNotification({
        variant: 'danger',
        title: 'Couldn’t download export',
        description: 'Reinitiate this export to try again.',
      });
    },
  });

  const fetchFunc = async (fetchIds) => {
    if (fetchIds.length === 0) {
      return [];
    }

    const idFilter = toIdFilter(fetchIds);
    const results = await fetchBatched(
      apiV2Enabled ? fetchSystemsRest : fetchSystemsGraphQL,
      fetchIds.length,
      {
        ...(idFilter && { exclusiveFilter: idFilter }),
      }
    );

    return results.flatMap((result) => result.entities);
  };

  const onSelectCallback = async (selectedIds) => {
    dispatch(setDisabledSelection(true));

    const systems = await fetchFunc(selectedIds);
    setSelectedSystems(systems);

    dispatch(setDisabledSelection(false));
    onSelect && onSelect(systems);
  };

  const itemIdsInTable = async () => {
    const results = await fetchBatched(
      apiV2Enabled ? fetchSystemsRest : fetchSystemsGraphQL,
      total
    );
    return results.flatMap((result) => result.entities.map(({ id }) => id));
  };

  const bulkSelect = useBulkSelect({
    total,
    onSelect: onSelectCallback,
    preselected,
    itemIdsInTable,
    itemIdsOnPage: () => currentPageIds,
  });

  return {
    selectedSystems,
    ...bulkSelect,
    toolbarProps: {
      ...bulkSelect.toolbarProps,
      bulkSelect: {
        ...bulkSelect.toolbarProps.bulkSelect,
        ...(isLoading
          ? {
              isDisabled: true,
              toggleProps: {
                children: [<Spinner size="md" key="spinner" />],
              },
            }
          : {}),
      },
    },
  };
};
