import React, { useEffect, useState, useRef, useCallback } from 'react';
import { withApollo } from '@apollo/react-hoc';
import PropTypes from 'prop-types';
import { useStore, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components';
import { FilterConfigBuilder } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { asyncInventoryLoader, policyFilter, initFilterState } from './constants';
import { systemsReducer } from 'Store/Reducers/SystemStore';
import { selectAll, clearSelection } from 'Store/ActionTypes';
import { exportFromState } from 'Utilities/Export';
import { DEFAULT_SYSTEMS_FILTER_CONFIGURATION, COMPLIANT_SYSTEMS_FILTER_CONFIGURATION } from '@/constants';
import debounce from 'lodash/debounce';
import {
    ErrorPage,
    StateView,
    StateViewPart
} from 'PresentationalComponents';
import { Alert } from '@patternfly/react-core';
import { TableVariant } from '@patternfly/react-table';
import {
    ComplianceRemediationButton
} from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { systemsWithRuleObjectsFailed } from 'Utilities/ruleHelpers';

const InventoryTable = ({
    columns,
    showAllSystems,
    policyId,
    query,
    client,
    showActions,
    enableExport,
    compliantFilter,
    policies,
    showOnlySystemsWithTestResults,
    showOsFilter,
    error,
    showComplianceSystemsInfo,
    compact,
    remediationsEnabled
}) => {
    const store = useStore();
    const inventory = useRef(null);
    const [pagination, setPagination] = useState({
        perPage: 50,
        page: 1
    });
    const [activeFilters, setActiveFilters] = useState();
    const [filterConfig, setFilterConfig] = useState();
    const [ConnectedInventory, setInventory] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const total = useSelector(({ entities }) => entities?.systemsCount) || 0;
    const items = useSelector(({ entities } = {}) => (entities?.systems?.map((system) => (
        system?.node?.id
    )) || []), shallowEqual);
    const selectedEntities = useSelector(({ entities } = {}) => (entities?.selectedEntities || []), shallowEqual);
    const dispatch = useDispatch();
    const onBulkSelect = (isSelected) => isSelected ? dispatch(selectAll()) : dispatch(clearSelection());
    const onFilterUpdate = (filter, selectedValues) => setActiveFilters({
        ...activeFilters,
        [filter]: selectedValues
    });

    const fetchSystems = (perPage = 50, page = 1, activeFilters = {}) => {
        setIsLoaded(false);

        const filter = filterConfig.getFilterBuilder().buildFilterString(activeFilters);
        return client.query({
            query,
            fetchResults: true,
            fetchPolicy: 'no-cache',
            variables: {
                filter: [
                    ...showOnlySystemsWithTestResults ? ['has_test_results = true'] : [],
                    ...filter?.length > 0 ? [filter] : [],
                    ...policyId?.length > 0 ? [`policy_id = ${policyId}`] : []
                ].join(' and '),
                perPage,
                page,
                policyId
            }
        }).then(({ data, loading }) => {
            dispatch({
                type: 'UPDATE_SYSTEMS',
                systems: data.systems.edges,
                systemsCount: data.systems.totalCount
            });
            setIsLoaded(true);
            setPagination(() => ({ page, perPage }));
            return { data, loading };
        });
    };

    const debounceFetchSystems = useCallback(debounce(fetchSystems, 800), [filterConfig]);

    useEffect(() => {
        (async () => {
            const {
                INVENTORY_ACTION_TYPES,
                inventoryConnector,
                mergeWithEntities
            } = await asyncInventoryLoader();
            getRegistry().register({
                ...mergeWithEntities(
                    systemsReducer(
                        INVENTORY_ACTION_TYPES, columns, showAllSystems, policyId
                    ))
            });
            const { InventoryTable } = inventoryConnector(store);
            setInventory(() => InventoryTable);
        })();
    }, []);

    useEffect(() => {
        setFilterConfig(new FilterConfigBuilder([
            ...DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
            ...(compliantFilter ? COMPLIANT_SYSTEMS_FILTER_CONFIGURATION : []),
            ...(policies?.length > 0 ? policyFilter(policies, showOsFilter) : [])
        ]));
    }, [compliantFilter, policies]);

    useEffect(() => {
        if (activeFilters) {
            debounceFetchSystems(pagination.perPage, 1, activeFilters);
        }
    }, [activeFilters]);

    const onRefresh = (options, callback) => {
        query && fetchSystems(options.per_page, options.page, activeFilters);
        if (!callback && inventory && inventory.current) {
            inventory.current.onRefreshData(options);
        } else if (callback) {
            callback(options);
        }
    };

    return <StateView stateValues={{ error, noError: error === undefined }}>
        <StateViewPart stateKey='error'>
            <ErrorPage error={error}/>
        </StateViewPart>
        <StateViewPart stateKey='noError'>

            { showComplianceSystemsInfo && <Alert
                isInline
                variant="info"
                title={ 'The list of systems in this view is different than those that appear in the Inventory. ' +
                    'Only systems previously or currently associated with compliance policies are displayed.' } /> }
            {ConnectedInventory ?
                <ConnectedInventory
                    tableProps={{
                        canSelectAll: false
                    }}
                    variant={compact ? TableVariant.compact : ''}
                    isLoaded={isLoaded}
                    ref={inventory}
                    onRefresh={onRefresh}
                    bulkSelect={{
                        checked: selectedEntities.length > 0 ?
                            (items?.every(id => selectedEntities?.find((selected) => selected?.id === id)) ? true : null)
                            : false,
                        onSelect: onBulkSelect,
                        count: selectedEntities.length,
                        label: selectedEntities.length > 0 ? `${ selectedEntities.length } Selected` : undefined
                    }}
                    {...!showAllSystems && {
                        ...pagination,
                        isLoaded,
                        items,
                        total,
                        filterConfig: filterConfig.buildConfiguration(
                            onFilterUpdate,
                            activeFilters || {},
                            { hideLabel: true }
                        ),
                        activeFiltersConfig: {
                            filters: filterConfig.getChipBuilder().chipsFor(activeFilters || {}),
                            onDelete: (_event, chips, clearAll = false) => setActiveFilters(() => clearAll ?
                                initFilterState(filterConfig) :
                                filterConfig.removeFilterWithChip(chips[0], activeFilters))
                        },
                        ...remediationsEnabled && {
                            dedicatedAction: <ComplianceRemediationButton
                                allSystems={ systemsWithRuleObjectsFailed(selectedEntities) }
                                selectedRules={ [] } />
                        }
                    }}
                    {...enableExport && {
                        exportConfig: {
                            isDisabled: total === 0 && selectedEntities.length === 0,
                            onSelect: (_, format) => exportFromState(store.getState()?.entities, format)
                        }
                    }}
                    {...showActions && {
                        actions: [{
                            title: 'View in inventory',
                            onClick: (_event, _index, { id }) => {
                                const beta = window.location.pathname.split('/')[1] === 'beta';
                                window.location.href = `${window.location.origin}${beta ? '/beta' : ''}/insights/inventory/${id}`;
                            }
                        }]
                    }}
                /> :
                <SkeletonTable colSize={2} rowSize={15} />}
        </StateViewPart>
    </StateView>;
};

InventoryTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({})),
    policies: PropTypes.arrayOf(PropTypes.shape({})),
    client: PropTypes.object,
    showAllSystems: PropTypes.bool,
    policyId: PropTypes.string,
    query: PropTypes.string,
    showActions: PropTypes.bool,
    enableExport: PropTypes.bool,
    compliantFilter: PropTypes.bool,
    showOnlySystemsWithTestResults: PropTypes.bool,
    showOsFilter: PropTypes.bool,
    showComplianceSystemsInfo: PropTypes.bool,
    error: PropTypes.object,
    compact: PropTypes.bool,
    remediationsEnabled: PropTypes.bool
};

InventoryTable.defaultProps = {
    policyId: '',
    showActions: true,
    enableExport: true,
    compliantFilter: false,
    showOnlySystemsWithTestResults: false,
    showComplianceSystemsInfo: false,
    compact: false,
    remediationsEnabled: true
};

export default withApollo(InventoryTable);
