import React, { useLayoutEffect, useState, } from 'react';
import { withApollo } from '@apollo/react-hoc';
import PropTypes from 'prop-types';
import { useStore, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import SkeletonTable from '@redhat-cloud-services/frontend-components/SkeletonTable';
import { policyFilter } from './constants';
import { selectAll, clearSelection } from 'Store/ActionTypes';
import { entitiesReducer } from 'Store/Reducers/SystemStore';
import { exportFromState } from 'Utilities/Export';
import { DEFAULT_SYSTEMS_FILTER_CONFIGURATION, COMPLIANT_SYSTEMS_FILTER_CONFIGURATION } from '@/constants';
import {
    ErrorPage,
    StateView,
    StateViewPart
} from 'PresentationalComponents';
import { Alert } from '@patternfly/react-core';
import { TableVariant } from '@patternfly/react-table';
// eslint-disable-next-line max-len
import ComplianceRemediationButton from '@redhat-cloud-services/frontend-components-inventory-compliance/ComplianceRemediationButton';
import { systemsWithRuleObjectsFailed } from 'Utilities/ruleHelpers';
import useFilterConfig from 'Utilities/hooks/useFilterConfig';
import { InventoryTable as FECInventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import selectedColumns from './Columns';

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
    remediationsEnabled,
    systemProps,
    defaultFilter
}) => {
    const tableColumns = selectedColumns(columns);
    const store = useStore();
    const dispatch = useDispatch();
    const [pagination, setPagination] = useState({
        perPage: 50,
        page: 1
    });
    const { conditionalFilter, activeFilters, buildFilterString } = useFilterConfig([
        ...DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
        ...(compliantFilter ? COMPLIANT_SYSTEMS_FILTER_CONFIGURATION : []),
        ...(policies?.length > 0 ? policyFilter(policies, showOsFilter) : [])
    ]);
    const total = useSelector(({ entities }) => entities?.systemsCount) || 0;
    const items = useSelector(({ entities } = {}) => (entities?.systems?.map((system) => (
        system?.node?.id
    )) || []), shallowEqual);
    const selectedEntities = useSelector(({ entities } = {}) => (entities?.selectedEntities || []), shallowEqual);
    const onBulkSelect = (isSelected) => isSelected ? dispatch(selectAll()) : dispatch(clearSelection());

    const fetchSystems = (perPage = pagination.perPage, page = pagination.page) => {
        const filterString = buildFilterString();
        const combindedFilter = [
            ...showOnlySystemsWithTestResults ? ['has_test_results = true'] : [],
            ...filterString?.length > 0 ? [filterString] : []
        ].join(' and ');
        const filter = defaultFilter ? `(${ defaultFilter }) and (${ combindedFilter })` : combindedFilter;

        return client.query({
            query,
            fetchResults: true,
            fetchPolicy: 'no-cache',
            variables: {
                filter,
                perPage,
                page,
                ...policyId && { policyId }
            }
        });
    };

    const getEntities = async (...args) => {
        console.log('getEntities', ...args);
        const fetchedSystems = await fetchSystems();
        const systems = fetchedSystems.data.systems.edges.map((e) => e.node);
        console.log('Entities systems: ', systems, activeFilters);

        return {
            results: systems,
            perPage: pagination.perPage,
            per_page: pagination.perPage,
            filters: activeFilters,
            total: systems.length
        };
    };

    useLayoutEffect(() => {
        // This is a hack. When using the InventoryTable in multiple places of one app
        // the redux store persists between these and will show an old state before updating correctly
        getRegistry().register({ entities: {} });
    }, []);

    return <StateView stateValues={{ error, noError: error === undefined }}>
        <StateViewPart stateKey='error'>
            <ErrorPage error={error}/>
        </StateViewPart>
        <StateViewPart stateKey='noError'>

            { showComplianceSystemsInfo && <Alert
                isInline
                variant="info"
                title={ 'The list of systems in this view is different than those that appear in the Inventory. ' +
                    'Only systems currently associated with or reporting against compliance policies are displayed.' } /> }
            <FECInventoryTable
                { ...systemProps }
                getEntities={ getEntities }
                onLoad={({
                    INVENTORY_ACTION_TYPES,
                    mergeWithEntities
                }) => {
                    getRegistry().register({
                        ...mergeWithEntities(
                            entitiesReducer(
                                INVENTORY_ACTION_TYPES, tableColumns
                            )
                        )
                    });
                }}
                hideFilters={{
                    name: true,
                    tags: true,
                    registeredWith: true,
                    stale: true
                }}
                fallback={<SkeletonTable colSize={2} rowSize={15} />}
                tableProps={{
                    canSelectAll: false
                }}
                variant={compact ? TableVariant.compact : ''}
                bulkSelect={{
                    checked: selectedEntities.length > 0 ?
                        (items?.every(id => selectedEntities?.find((selected) => selected?.id === id)) ? true : null)
                        : false,
                    onSelect: onBulkSelect,
                    count: selectedEntities.length,
                    label: selectedEntities.length > 0 ? `${ selectedEntities.length } Selected` : undefined
                }}
                {...!showAllSystems && {
                    ...conditionalFilter,
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
            />
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
    remediationsEnabled: PropTypes.bool,
    defaultFilter: PropTypes.string,
    systemProps: PropTypes.shape({
        isFullView: PropTypes.bool
    })
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
