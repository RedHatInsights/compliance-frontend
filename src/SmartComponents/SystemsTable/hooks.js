import { useEffect, useLayoutEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useDispatch } from 'react-redux';
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';
import useCollection from 'Utilities/hooks/api/useCollection';
import { systemsWithRuleObjectsFailed } from 'Utilities/ruleHelpers';
import { osMinorVersionFilter, GET_MINIMAL_SYSTEMS } from './constants';
import useExport from 'Utilities/hooks/useTableTools/useExport';
import { useBulkSelect } from 'Utilities/hooks/useTableTools/useBulkSelect';

const groupByMajorVersion = (versions = [], showFilter = []) => {
    const showVersion = (version) => {
        if (showFilter.length > 0) {
            return showFilter.map(String).includes(String(version));
        } else {
            return true;
        }
    };

    return versions.reduce((acc, currentValue) => {
        if (showVersion(currentValue.osMajorVersion)) {
            acc[String(currentValue.osMajorVersion)] = [...new Set(
                [...acc[currentValue.osMajorVersion] || [], currentValue.osMinorVersion]
            )];
        }

        return acc;
    }, []);
};

export const useOsMinorVersionFilter = (showFilter) => {
    const { data: supportedSsgs } = useCollection('supported_ssgs', {
        type: 'supportedSsg',
        skip: !showFilter
    });

    return showFilter ? osMinorVersionFilter(groupByMajorVersion(supportedSsgs?.collection, showFilter)) : [];
};

export const useSystemsFilter = (
    filterString, showOnlySystemsWithTestResults, defaultFilter
) => {
    const combindedFilter = [
        ...showOnlySystemsWithTestResults ? ['has_test_results = true'] : [],
        ...filterString?.length > 0 ? [filterString] : []
    ].join(' and ');
    const filter = defaultFilter ?
        `(${ defaultFilter })` +
        (combindedFilter ? ` and (${ combindedFilter })` : '') : combindedFilter;

    return filter;
};

export const useFetchSystems = ({
    query,
    onComplete,
    variables = {}
}) => {
    const client = useApolloClient();

    return (perPage, page, requestVariables = {}) => (
        client.query({
            query,
            fetchResults: true,
            fetchPolicy: 'no-cache',
            variables: {
                perPage,
                page,
                ...variables,
                ...requestVariables
            }
        }).then(({ data }) => {
            const systems = data?.systems?.edges?.map((e) => e.node) || [];
            const entities = systemsWithRuleObjectsFailed(systems);
            const result = {
                entities,
                meta: {
                    totalCount: data?.systems?.totalCount || 0
                }
            };

            onComplete && onComplete(result);
            return result;
        })
    );
};

const fetchBatched = (fetchFunction, total, filter, batchSize = 100) => {
    const pages = Math.ceil(total / batchSize) || 1;
    return Promise.all([...new Array(pages)].map((_, pageIdx) => (
        fetchFunction(batchSize, pageIdx + 1, filter)
    )));
};

const buildApiFilters = (filters = {}) => {
    const { tagFilters, ...otherFilters } = filters;
    const tagsApiFilter = tagFilters ? {
        tags: tagFilters.flatMap((tagFilter) => (
            tagFilter.values.map((tag) => (
                `${ encodeURIComponent(tagFilter.key) }/${ encodeURIComponent(tag.tagKey) }=${ encodeURIComponent(tag.value) }`
            ))
        ))
    } : {};

    return {
        ...otherFilters,
        ...tagsApiFilter
    };
};

export const useGetEntities = (fetchEntities, { selected, columns } = {}) => {
    const appendDirection = (attributes, direction) => (
        attributes.map((attribute) => `${attribute}:${direction}`)
    );

    const findColumnByKey = (key) => (
        (columns || []).find((column) => column.key === key)
    );

    return async (_ids, { page = 1, per_page: perPage, orderBy, orderDirection, filters }) => {
        const sortableColumn = findColumnByKey(orderBy);
        const sortBy = sortableColumn && sortableColumn.sortBy ?
            appendDirection(sortableColumn.sortBy, orderDirection) : undefined;
        const filterForApi = buildApiFilters(filters);

        const fetchedEntities = await fetchEntities(perPage, page, {
            ...filterForApi,
            sortBy
        });
        const { entities, meta: { totalCount } } = fetchedEntities || {};

        return {
            results: entities.map((entity) => ({
                ...entity,
                selected: (selected || []).map((id) => (id)).includes(entity.id)
            })),
            orderBy,
            orderDirection,
            total: totalCount
        };
    };
};

// This hook is primarily meant to work around issues in the inventory
export const useInventoryUtilities = (inventory, selectedSystems, activeFilters) => {
    const dispatch = useDispatch();

    // Resets the Inventory to a loading state
    // and prevents previously shown columns and rows to appear
    useLayoutEffect(() => {
        dispatch({
            type: 'INVENTORY_INIT'
        });
    }, []);

    // Ensures rows are marked as selected
    useEffect(() => {
        dispatch({
            type: 'SELECT_ENTITIES',
            payload: {
                selected: selectedSystems
            }
        });
    }, [selectedSystems]);

    // Filters do not yet trigger the inventory to call getEntities
    // and the page would not reset to page 1
    const resetPage = () => {
        Promise.resolve(dispatch({
            type: 'RESET_PAGE'
        })).then(() =>
            inventory?.current?.onRefreshData()
        );
    };

    // The debounce is to not have filter updates collide or get out of order.
    const debounceResetPage = debounce(resetPage, 50);

    useEffect(() => {
        debounceResetPage();
    }, [activeFilters]);
};

const toIdFilter = (ids) => (
    (ids?.length > 0) ? `id ^ (${ ids.join(',') })` : undefined
);

export const useSystemsExport = ({
    columns, selected, total, fetchArguments
}) => {
    const selectionFilter = selected ? toIdFilter(selected) : undefined;
    const fetchSystems = useFetchSystems({
        query: fetchArguments.query,
        variables: {
            ...fetchArguments.variables,
            filter: selectionFilter ?
                `${ fetchArguments.variables.filter } and (${ selectionFilter })` :
                fetchArguments.variables.filter
        }
    });

    const selectedFilter = () => (
        selected?.length > 0 ? toIdFilter(selected) : undefined
    );

    const exporter = async () => {
        const fetchedItems = await fetchBatched(fetchSystems, total, selectedFilter());
        return fetchedItems.flatMap((result) => (
            result.entities
        ));
    };

    const { toolbarProps: { exportConfig } } = useExport({
        exporter,
        columns,
        isDisabled: total === 0
    });

    return exportConfig;
};

export const useSystemBulkSelect = ({
    total,
    onSelect,
    preselected,
    fetchArguments,
    currentPageIds,
    systemsCache = []
}) => {
    // This is meant as a compatibility layer and to be removed
    const [selectedSystems, setSelectedSystems] = useState([]);
    const fetchSystems = useFetchSystems({
        ...fetchArguments,
        query: GET_MINIMAL_SYSTEMS
    });

    const fetchFunc = async (fetchIds) => {
        const idFilter = toIdFilter(fetchIds);
        const results = await fetchBatched(fetchSystems, fetchIds.length, {
            ...idFilter && { filter: idFilter }
        });
        return results.flatMap((result) => (
            result.entities
        ));
    };

    const cachedOrFetch = async (selectedIds) => {
        const cachedSystems = systemsCache.filter(({ id }) => (selectedIds.includes(id)));
        const cachedIds = cachedSystems.map(({ id }) => (id));
        const fetchIds = selectedIds.filter((id) => (!cachedIds.includes(id)));
        const fetchedSystems = await fetchFunc(fetchIds);

        return [
            ...cachedSystems,
            ...fetchedSystems
        ];
    };

    const onSelectCallback = async (selectedIds) => {
        const systems = await cachedOrFetch(selectedIds);
        setSelectedSystems(systems);
        onSelect && onSelect(systems);
    };

    const itemIdsInTable = async () => {
        const results = await fetchBatched(fetchSystems, total);
        return results.flatMap((result) => (
            result.entities.map(({ id }) => (id))
        ));
    };

    const bulkSelect = useBulkSelect({
        total,
        onSelect: onSelectCallback,
        preselected,
        itemIdsInTable,
        itemIdsOnPage: () => (currentPageIds)
    });
    return {
        selectedSystems,
        ...bulkSelect
    };
};

export const useTags = (tagsEnabled) => (
    tagsEnabled ? {
        props: {
            hideFilters: {
                name: true,
                tags: false,
                registeredWith: true,
                stale: true
            },
            showTags: true
        }
    } : {
        props: {
            hideFilters: {
                name: true,
                tags: true,
                registeredWith: true,
                stale: true
            }
        }
    }
);
