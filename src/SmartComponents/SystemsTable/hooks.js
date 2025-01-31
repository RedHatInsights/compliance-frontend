import React, { useEffect, useLayoutEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Spinner } from '@patternfly/react-core';
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';
import {
  applyInventoryFilters,
  groupFilterHandler,
  osFilterHandler,
  nameFilterHandler,
} from './constants';
import useExport from 'Utilities/hooks/useTableTools/useExport';
import { useBulkSelect } from 'Utilities/hooks/useTableTools/useBulkSelect';
import { dispatchNotification } from 'Utilities/Dispatcher';
import usePromiseQueue from 'Utilities/hooks/usePromiseQueue';
import { setDisabledSelection } from '../../store/Actions/SystemActions';
import { useFetchSystemsV2 } from './hooks/useFetchSystems';
import useLoadedItems from './hooks/useLoadedItems';
import useSystem from '../../Utilities/hooks/api/useSystem';

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

const buildApiFilters = (filters = {}, ignoreOsMajorVersion) => {
  const {
    tagFilters,
    hostGroupFilter,
    osFilter,
    hostnameOrId,
    ...otherFilters
  } = filters;

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

  return {
    ...otherFilters,
    ...tagsApiFilter,
    filter: applyInventoryFilters(
      [groupFilterHandler, osFilterHandler, nameFilterHandler],
      {
        osFilter,
        hostGroupFilter,
        hostnameOrId,
      },
      ignoreOsMajorVersion
    ),
  };
};

export const useGetEntities = (
  fetchEntities,
  { selected, columns, ignoreOsMajorVersion } = {}
) => {
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
    const filterForApi = buildApiFilters(filters, ignoreOsMajorVersion);

    const fetchedEntities = await fetchEntities(perPage, page, {
      ...filterForApi,
      sortBy,
    });

    const {
      entities,
      meta: { totalCount },
    } = fetchedEntities || {};

    return {
      results:
        entities?.map((entity) => ({
          ...entity,
          selected: (selected || []).map((id) => id).includes(entity.id),
        })) || [],
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

export const useSystemsExport = ({ columns, selectedItems, total }) => {
  const exporter = async () => selectedItems;

  const {
    toolbarProps: { exportConfig },
  } = useExport({
    exporter,
    columns,
    isDisabled: total === 0,
    onStart: useCallback(() => {
      dispatchNotification({
        variant: 'info',
        title: 'Preparing export',
        description: 'Once complete, your download will start automatically.',
      });
    }, []),
    onComplete: useCallback(() => {
      dispatchNotification({
        variant: 'success',
        title: 'Downloading export',
      });
    }, []),
    onError: useCallback(() => {
      dispatchNotification({
        variant: 'danger',
        title: 'Couldn’t download export',
        description: 'Reinitiate this export to try again.',
      });
    }, []),
  });

  return exportConfig;
};

export const useSystemBulkSelect = ({
  total,
  onSelect,
  preselectedSystems,
  fetchArguments,
  currentPageItems,
  fetchApi,
  tableLoaded,
}) => {
  const dispatch = useDispatch();
  const { isLoading, fetchBatched } = useFetchBatched();
  const { loadedItems, addToLoadedItems, allLoaded } = useLoadedItems(
    currentPageItems,
    total
  );
  const { fetch: fetchSystem } = useSystem({ skip: true });

  useEffect(() => {
    const checkFirstPreselected = async () => {
      for (const preselectedSystemId of preselectedSystems) {
        if (
          currentPageItems.find(({ id }) => preselectedSystemId === id) ===
          undefined
        ) {
          const system = await fetchSystem([preselectedSystemId], false);
          addToLoadedItems([system.data]);
        }
      }
    };

    if (currentPageItems !== undefined && tableLoaded === true) {
      checkFirstPreselected();
    }
  }, [tableLoaded, currentPageItems]);

  useEffect(() => {
    if (tableLoaded === true && currentPageItems !== undefined) {
      addToLoadedItems(currentPageItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fetchArguments), addToLoadedItems]);

  const onError = useCallback((error) => {
    dispatchNotification({
      variant: 'danger',
      title: 'Error selecting systems',
      description: error.message,
    });
  }, []);

  const fetchSystemsRest = useFetchSystemsV2(
    fetchApi,
    undefined,
    onError,
    fetchArguments
  );

  const onSelectCallback = async (selectedIds) => {
    dispatch(setDisabledSelection(true));
    const systemsSelection = loadedItems.filter(({ id }) =>
      selectedIds.includes(id)
    );
    onSelect && onSelect(systemsSelection);
    dispatch(setDisabledSelection(false));
  };

  const getItemsInTable = async () => {
    let items = [];

    if (allLoaded) {
      items = loadedItems;
    } else {
      const results = await fetchBatched(fetchSystemsRest, total);
      items = results.flatMap((result) => result.entities);
      addToLoadedItems(items);
    }

    return items;
  };

  const itemIdsInTable = async () => {
    const items = await getItemsInTable();

    return items.map(({ id }) => id);
  };

  const itemIdsOnPage = () =>
    currentPageItems !== undefined && tableLoaded === true
      ? currentPageItems.map(({ id }) => id)
      : [];

  const bulkSelect = useBulkSelect({
    total,
    onSelect: onSelectCallback,
    preselected: preselectedSystems,
    itemIdsInTable,
    itemIdsOnPage,
  });

  const selectedItems = bulkSelect?.selectedIds.map((id) =>
    loadedItems.find((item) => id === item.id)
  );

  return {
    selectedItems,
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
