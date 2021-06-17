import { useEffect, useLayoutEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useDispatch } from 'react-redux';
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';
import useCollection from 'Utilities/hooks/api/useCollection';
import { systemsWithRuleObjectsFailed } from 'Utilities/ruleHelpers';
import { osMinorVersionFilter } from './constants';
import useExport from 'Utilities/hooks/useTableTools/useExport';

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

        const fetchedEntities = await fetchEntities(perPage, page, {
            filters,
            sortBy
        });
        const { entities, meta: { totalCount } } = fetchedEntities || {};

        return {
            results: entities.map((entity) => ({
                ...entity,
                selected: (selected || []).map((item) => (item.id)).includes(entity.id)
            })),
            orderBy,
            orderDirection,
            total: totalCount
        };
    };
};

export const useOnSelect = (onSelectProp, items, preselectedSystems, total) => {
    const [selectedSystems, setSelected] = useState(preselectedSystems);
    const selectedSystemIds = selectedSystems.map((system) => (system.id));
    const isPageSelected = items.filter((item) => (
        selectedSystemIds.includes(item.id)
    )).length === items.length;

    const onSelectCallback = (selected) => (
        onSelectProp && onSelectProp(selected)
    );

    const onSelect = (_event, select, _index, row) => {
        const system = items.find(({ id }) => id === row.id);
        if (!system) {
            console.error(`System identifed as ${row.id} not found in items for selection!`);
            return;
        }

        const selected = select
            ? [...selectedSystems, system]
            : selectedSystems.filter((selected) => (selected.id !== row.id));

        setSelected(selected);
        onSelectCallback(selected);
    };

    const onBulkSelect = () => {
        const selectedSystemsWithoutItems = (selectedSystems || []).filter((system) => (
            !(items.map((item) => (item.id))).includes(system.id)
        ));
        const notAllSelected = selectedSystems.length <= total;
        const selected = notAllSelected ? (
            !isPageSelected ? [...selectedSystemsWithoutItems, ...items] : selectedSystemsWithoutItems
        ) : [];

        setSelected(selected);
        onSelectCallback(selected);
    };

    useEffect(() => {
        setSelected(preselectedSystems);
    }, [preselectedSystems]);

    return {
        onSelect,
        onBulkSelect,
        selectedSystems,
        isPageSelected
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
    columns, filter, policyId, query, selected, total
}) => {
    const selectionFilter = selected ? toIdFilter(selected) : undefined;
    const fetchSystems = useFetchSystems({
        query,
        variables: {
            filter: selectionFilter ?
                `${ filter } and (${ selectionFilter })` : filter,
            ...policyId && { policyId }
        }
    });

    const fetchBatched = (total, filter) => {
        const BATCH_SIZE = 100;
        const pages = Math.floor(total / BATCH_SIZE) + 1;
        return Promise.all([...new Array(pages)].map((_, pageIdx) => (
            fetchSystems(BATCH_SIZE, pageIdx + 1, filter)
        )));
    };

    const selectedFilter = () => (
        selected?.length > 0 ? toIdFilter(selected) : undefined
    );

    const exporter = async () => {
        const fetchedItems = await fetchBatched(total, selectedFilter());
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
