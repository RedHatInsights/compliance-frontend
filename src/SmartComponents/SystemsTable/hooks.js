import { useEffect, useLayoutEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useDispatch } from 'react-redux';
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';
import useCollection from 'Utilities/hooks/api/useCollection';
import { systemsWithRuleObjectsFailed } from 'Utilities/ruleHelpers';
import { osMinorVersionFilter } from './constants';

const groupByMajorVersion = (versions = [], showFilter) => {
    const showVersion = (version) => {
        if (showFilter.length > 0) {
            return Array(showFilter).map(String).includes(String(version));
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

export const useFetchSystems = (
    query, policyId, buildFilterString, showOnlySystemsWithTestResults, defaultFilter, onComplete
) => {
    const client = useApolloClient();
    const filterString = buildFilterString();
    const combindedFilter = [
        ...showOnlySystemsWithTestResults ? ['has_test_results = true'] : [],
        ...filterString?.length > 0 ? [filterString] : []
    ].join(' and ');
    const filter = defaultFilter ?
        `(${ defaultFilter })` +
        `${ combindedFilter ? `and (${ combindedFilter })` : '' })` : combindedFilter;

    return (perPage, page) => (
        client.query({
            query,
            fetchResults: true,
            fetchPolicy: 'no-cache',
            variables: {
                filter,
                perPage,
                page,
                ...policyId && { policyId }
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

export const useGetEntities = (fetchEntities, { selected }) => (
    async (_ids, { page = 1, per_page: perPage }) => {
        const fetchedEntities = await fetchEntities(perPage, page);
        const { entities, meta: { totalCount } } = fetchedEntities || {};

        return {
            results: entities.map((entity) => ({
                ...entity,
                selected: selected.map((item) => (item.id)).includes(entity.id)
            })),
            total: totalCount
        };
    }
);

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
