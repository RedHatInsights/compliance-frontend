import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useStore } from 'react-redux';
import { Alert, Spinner } from '@patternfly/react-core';
import { TableVariant } from '@patternfly/react-table';
// eslint-disable-next-line max-len
import ComplianceRemediationButton from '@redhat-cloud-services/frontend-components-inventory-compliance/ComplianceRemediationButton';
import { exportFromState } from 'Utilities/Export';
import { DEFAULT_SYSTEMS_FILTER_CONFIGURATION, COMPLIANT_SYSTEMS_FILTER_CONFIGURATION } from '@/constants';
import { ErrorPage, StateView, StateViewPart } from 'PresentationalComponents';
import { systemsWithRuleObjectsFailed } from 'Utilities/ruleHelpers';
import useFilterConfig from 'Utilities/hooks/useFilterConfig';
import { InventoryTable as FECInventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { policyFilter, defaultOnLoad } from './constants';
import {
    useFetchSystems, useGetEntities, useOsMinorVersionFilter, useInventoryUtilities, useOnSelect
} from './hooks';

export const InventoryTable = ({
    columns,
    showAllSystems,
    policyId,
    query,
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
    defaultFilter,
    emptyStateComponent,
    prependComponent,
    showOsMinorVersionFilter,
    preselectedSystems,
    onSelect: onSelectProp
}) => {
    const store = useStore();
    const inventory = useRef(null);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    const {
        onSelect, onBulkSelect, selectedSystems, isPageSelected
    } = useOnSelect(onSelectProp, items, preselectedSystems, total);
    const selectedIds = selectedSystems?.map((system) => (system.id));
    const selectedItems = items.filter((item) => (selectedIds.includes(item.id)));
    const selectedCount = selectedSystems.length;

    const osMinorVersionFilter = useOsMinorVersionFilter(showOsMinorVersionFilter);
    const { conditionalFilter, activeFilters, buildFilterString, activeFilterValues } = useFilterConfig([
        ...DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
        ...(compliantFilter ? COMPLIANT_SYSTEMS_FILTER_CONFIGURATION : []),
        ...(policies?.length > 0 ? policyFilter(policies, showOsFilter) : []),
        ...osMinorVersionFilter
    ]);

    useInventoryUtilities(inventory, selectedSystems, activeFilterValues);

    const onComplete = (result) => {
        setTotal(result.meta.totalCount);
        setItems(result.entities);
        setIsLoaded(true);

        if (emptyStateComponent &&
            result.meta.totalCount === 0 &&
            activeFilterValues.length === 0) {
            setIsEmpty(true);
        }
    };

    const fetchSystems = useFetchSystems(
        query, policyId, buildFilterString, showOnlySystemsWithTestResults, defaultFilter, onComplete
    );
    const getEntities = useGetEntities(fetchSystems, { selected: selectedSystems });

    return <StateView stateValues={{ error, noError: error === undefined && !isEmpty, empty: isEmpty }}>
        <StateViewPart stateKey='error'>
            { !!prependComponent && prependComponent }
            <ErrorPage error={error}/>
        </StateViewPart>
        <StateViewPart stateKey='empty'>
            { emptyStateComponent }
        </StateViewPart>
        <StateViewPart stateKey='noError'>
            { !!prependComponent && isLoaded && prependComponent }
            { showComplianceSystemsInfo && <Alert
                isInline
                variant="info"
                title={ 'The list of systems in this view is different than those that appear in the Inventory. ' +
                    'Only systems currently associated with or reporting against compliance policies are displayed.' } /> }
            <FECInventoryTable
                { ...systemProps }
                ref={ inventory }
                activeFilters={ activeFilters }
                getEntities={ getEntities }
                onLoad={ defaultOnLoad(columns) }
                hideFilters={{
                    name: true,
                    tags: true,
                    registeredWith: true,
                    stale: true
                }}
                tableProps={{
                    canSelectAll: false,
                    ...items.length > 0 && { onSelect }
                }}
                fallback={ <Spinner /> }
                variant={ compact ? TableVariant.compact : '' }
                bulkSelect={{
                    checked: selectedCount > 0 ? (isPageSelected ? true : null) : false,
                    onSelect: items.length > 0 && onBulkSelect,
                    count: selectedCount,
                    label: selectedCount > 0 ? `${ selectedCount } Selected` : undefined
                }}
                {...!showAllSystems && {
                    ...conditionalFilter,
                    ...remediationsEnabled && {
                        dedicatedAction: <ComplianceRemediationButton
                            allSystems={ systemsWithRuleObjectsFailed(selectedItems) }
                            selectedRules={ [] } />
                    }
                }}
                {...enableExport && {
                    exportConfig: {
                        isDisabled: total === 0 && selectedCount === 0,
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
    showAllSystems: PropTypes.bool,
    policyId: PropTypes.string,
    query: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
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
    }),
    emptyStateComponent: PropTypes.node,
    prependComponent: PropTypes.node,
    showOsMinorVersionFilter: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.arrayOf(PropTypes.string)
    ]),
    preselectedSystems: PropTypes.array,
    onSelect: PropTypes.func
};

InventoryTable.defaultProps = {
    policyId: '',
    showActions: true,
    enableExport: true,
    compliantFilter: false,
    showOnlySystemsWithTestResults: false,
    showComplianceSystemsInfo: false,
    compact: false,
    remediationsEnabled: true,
    preselectedSystems: []
};

export default InventoryTable;
