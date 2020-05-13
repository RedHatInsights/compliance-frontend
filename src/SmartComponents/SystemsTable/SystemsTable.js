import React from 'react';
import propTypes from 'prop-types';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import { withApollo } from '@apollo/react-hoc';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import {
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import {
    ComplianceRemediationButton
} from '@redhat-cloud-services/frontend-components-inventory-compliance';
import registry from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import  {
    AssignPoliciesModal
} from 'SmartComponents';
import { exportFromState, selectAll, clearSelection, SELECT_ENTITY } from 'Store/ActionTypes';
import { systemsWithRuleObjectsFailed } from 'Utilities/ruleHelpers';
import { FilterConfigBuilder } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { entitiesReducer } from 'Store/Reducers/SystemStore';
import {
    DEFAULT_SYSTEMS_FILTER_CONFIGURATION, COMPLIANT_SYSTEMS_FILTER_CONFIGURATION
} from '@/constants';

export const GET_SYSTEMS = gql`
query getSystems($filter: String!, $perPage: Int, $page: Int) {
    systems(search: $filter, limit: $perPage, offset: $page) {
        totalCount
        edges {
            node {
                id
                name
                profiles {
                    id
                    name
                    refId
                    lastScanned
                    compliant
                    external
                    score
                    rules {
                        refId
                        title
                        compliant
                        remediationAvailable
                    }
                }
            }
        }
    }
}
`;

export const GET_SYSTEMS_WITHOUT_FAILED_RULES = gql`
query getSystems($filter: String!, $perPage: Int, $page: Int) {
    systems(search: $filter, limit: $perPage, offset: $page) {
        totalCount
        edges {
            node {
                id
                name
                profiles {
                    id
                    name
                    lastScanned
                    external
                    compliant
                    score
                }
            }
        }
    }
}
`;

const initialState = {
    page: 1
};

@registry()
class SystemsTable extends React.Component {
    inventory = React.createRef();
    filterConfig = new FilterConfigBuilder([
        ...DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
        ...(this.props.compliantFilter ? COMPLIANT_SYSTEMS_FILTER_CONFIGURATION : [])
    ]);
    chipBuilder = this.filterConfig.getChipBuilder();
    filterBuilder = this.filterConfig.getFilterBuilder();

    state = {
        ...initialState,
        InventoryCmp: React.forwardRef((_, ref) => <SkeletonTable ref={ref} colSize={2} rowSize={15} />), // eslint-disable-line
        policyId: this.props.policyId,
        perPage: 50,
        totalCount: 0,
        activeFilters: this.filterConfig.initialDefaultState()
    }

    componentDidMount = () => {
        this.props.clearAll();
        this.updateSystems().then(() => this.fetchInventory());
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.complianceThreshold !== this.props.complianceThreshold) {
            this.updateSystems();
        }
    }

    onRefresh = ({ page, per_page: perPage, ...options }) => {
        const { showAllSystems } = this.props;
        if (showAllSystems && this.inventory && this.inventory.current) {
            this.setState({ page, perPage }, () => { this.inventory.current.onRefreshData({
                page, perPage, ...options, per_page: perPage // eslint-disable-line camelcase
            }); }
            );
        } else {
            this.setState({ page, perPage }, this.updateSystems);
        }
    }

    fetchSystems = () => {
        const { client, showOnlySystemsWithTestResults, remediationsEnabled } = this.props;
        const { policyId, perPage, page, activeFilters } = this.state;
        let filter = this.filterBuilder.buildFilterString(activeFilters);

        if (showOnlySystemsWithTestResults) {
            filter = `has_test_results = true ${filter.length > 0 ? `and ${filter}` : ''}`;
        }

        if (policyId && policyId.length > 0) {
            filter = `profile_id = ${policyId} and ${filter}`;
        }

        return client.query({
            query: remediationsEnabled ? GET_SYSTEMS : GET_SYSTEMS_WITHOUT_FAILED_RULES,
            fetchResults: true,
            fetchPolicy: 'no-cache',
            variables: { filter, perPage, page, policyId }
        });
    }

    updateSystems = () => {
        const prevSystems = this.props.systems.map((s) => s.node.id).sort();
        return this.fetchSystems().then((items) => (
            this.props.updateSystems({
                systems: items.data.systems.edges,
                systemsCount: items.data.systems.totalCount
            })
        )).then(() => {
            const newSystems = this.props.systems.map((s) => s.node.id).sort();
            if (JSON.stringify(newSystems) === JSON.stringify(prevSystems)) {
                this.props.updateRows();
            }
        });
    }

    onExportSelect = (_, format) => (
        this.props.exportFromState(format)
    )

    onFilterUpdate = (filter, selectedValues) => {
        this.props.updateSystems({
            systems: [],
            systemsCount: 0
        });
        this.setState({
            ...initialState,
            activeFilters: {
                ...this.state.activeFilters,
                [filter]: selectedValues
            }
        }, this.updateSystems);
    }

    deleteFilter = (chips) => {
        const activeFilters =  this.filterConfig.removeFilterWithChip(
            chips, this.state.activeFilters
        );
        this.setState({
            ...initialState,
            activeFilters
        }, this.updateSystems);
    }

    clearAllFilter = () => {
        this.setState({
            ...initialState,
            activeFilters: this.filterConfig.initialDefaultState()
        }, this.updateSystems);
    }

    onFilterDelete = (_event, chips, clearAll = false) => {
        clearAll ? this.clearAllFilter() : this.deleteFilter(chips[0]);
    }

    onBulkSelect = () => {
        const { selectedEntities, selectAll, clearSelection, allSelectedOnPage } = this.props;

        if (selectedEntities.length === 0 ||
            (selectedEntities.length > 0 && !allSelectedOnPage)) {
            selectAll();
        } else {
            clearSelection();
        }
    }

    isExportDisabled = () => {
        const { total, selectedEntities } = this.props;
        return (total || 0) === 0 && selectedEntities.length === 0;
    }

    async fetchInventory() {
        const { columns, policyId, showAllSystems, clearInventoryFilter } = this.props;
        const {
            inventoryConnector,
            INVENTORY_ACTION_TYPES,
            mergeWithEntities
        } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReactTable
        });

        clearInventoryFilter();

        this.getRegistry().register({
            ...mergeWithEntities(
                entitiesReducer(
                    INVENTORY_ACTION_TYPES, columns, showAllSystems, policyId
                ))
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable
        });
    }

    render() {
        const {
            remediationsEnabled, compact, enableExport, showAllSystems, showActions,
            selectedEntities, systems, total
        } = this.props;
        const {
            page, perPage, InventoryCmp, selectedSystemId,
            selectedSystemFqdn, isAssignPoliciesModalOpen
        } = this.state;
        const filterConfig = this.filterConfig.buildConfiguration(
            this.onFilterUpdate,
            this.state.activeFilters,
            { hideLabel: true }
        );
        const filterChips = this.chipBuilder.chipsFor(this.state.activeFilters);
        const exportConfig = enableExport ? {
            isDisabled: this.isExportDisabled(),
            onSelect: this.onExportSelect
        } : {};
        const inventoryTableProps = {
            onRefresh: this.onRefresh,
            ref: this.inventory,
            page,
            perPage,
            exportConfig,
            tableProps: {
                canSelectAll: false
            },
            bulkSelect: {
                checked: selectedEntities.length > 0 ?
                    (this.props.allSelectedOnPage ? true : null)
                    : false,
                onSelect: this.onBulkSelect,
                count: selectedEntities.length,
                label: selectedEntities.length > 0 ? `${ selectedEntities.length } Selected` : undefined
            }
        };

        if (showActions) {
            inventoryTableProps.actions = [
                {
                    title: 'Edit policies for this system',
                    onClick: (_event, _index, { id, fqdn }) => {
                        this.setState((prev) => ({
                            isAssignPoliciesModalOpen: !prev.isAssignPoliciesModalOpen,
                            selectedSystemFqdn: fqdn,
                            selectedSystemId: id
                        }));
                    }
                }, {
                    title: 'View in inventory',
                    onClick: (_event, _index, { id }) => {
                        const beta = window.location.pathname.split('/')[1] === 'beta';
                        window.location.href = `${window.location.origin}${beta ? '/beta' : ''}/insights/inventory/${id}`;
                    }
                }
            ];
        }

        if (!showAllSystems) {
            inventoryTableProps.total = total;
            inventoryTableProps.items = systems.map((edge) => edge.node.id);
            inventoryTableProps.filterConfig = filterConfig;
            inventoryTableProps.activeFiltersConfig = {
                filters: filterChips,
                onDelete: this.onFilterDelete
            };
        }

        if (compact) {
            inventoryTableProps.variant = pfReactTable.TableVariant.compact;
        }

        return <InventoryCmp { ...inventoryTableProps }>
            { !showAllSystems && <reactCore.ToolbarGroup>
                { remediationsEnabled &&
                    <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--lg)' }}>
                        <ComplianceRemediationButton
                            allSystems={ systemsWithRuleObjectsFailed(
                                systems.filter(edge => selectedEntities.includes(edge.node.id)
                                ).map(edge => edge.node))}
                            selectedRules={ [] } />
                    </reactCore.ToolbarItem>
                }
            </reactCore.ToolbarGroup> }
            { selectedSystemId &&
            <AssignPoliciesModal
                isModalOpen={isAssignPoliciesModalOpen}
                id={selectedSystemId}
                fqdn={selectedSystemFqdn}
                toggle={(closedOrCanceled) => {
                    this.setState((prev) => (
                        { isAssignPoliciesModalOpen: !prev.isAssignPoliciesModalOpen }
                    ), !closedOrCanceled ? this.updateSystems : null);
                }}
            /> }
        </InventoryCmp>;
    }
}

SystemsTable.propTypes = {
    client: propTypes.object,
    policyId: propTypes.string,
    columns: propTypes.array,
    remediationsEnabled: propTypes.bool,
    compact: propTypes.bool,
    selectedEntities: propTypes.array,
    exportFromState: propTypes.func,
    enableExport: propTypes.bool,
    showAllSystems: propTypes.bool,
    complianceThreshold: propTypes.number,
    showOnlySystemsWithTestResults: propTypes.bool,
    showActions: propTypes.bool,
    compliantFilter: propTypes.bool,
    total: propTypes.number,
    clearInventoryFilter: propTypes.func,
    systems: propTypes.array,
    updateRows: propTypes.func,
    updateSystems: propTypes.func,
    clearSelection: propTypes.func,
    allSelectedOnPage: propTypes.bool,
    selectAll: propTypes.func,
    clearAll: propTypes.func
};

SystemsTable.defaultProps = {
    policyId: '',
    remediationsEnabled: true,
    compact: false,
    enableExport: true,
    showAllSystems: false,
    complianceThreshold: 0,
    showOnlySystemsWithTestResults: false,
    showActions: true,
    compliantFilter: false,
    selectedEntities: [],
    systems: [],
    clearAll: () => ({}),
    exportFromState: () => ({})
};

const mapStateToProps = state => {
    if (state.entities === undefined || state.entities.rows === undefined) {
        return { selectedEntities: [], systems: [] };
    }

    const allSelectedOnPage = state.entities.rows.filter((row) => (
        !(state.entities.selectedEntities || []).map((e) => e.id).includes(row.id)
    )).length === 0;

    return {
        allSelectedOnPage,
        selectedEntities: state.entities.selectedEntities,
        systems: state.entities.systems,
        total: state.entities.total
    };
};

const mapDispatchToProps = dispatch => {
    return {
        clearInventoryFilter: () => dispatch({ type: 'CLEAR_FILTERS' }),
        exportFromState: (format) => dispatch(exportFromState(format)),
        updateSystems: (args) => {
            dispatch({
                type: 'UPDATE_SYSTEMS',
                ...args
            });
        },
        updateRows: () => dispatch({ type: 'UPDATE_ROWS' }),
        selectAll: () => dispatch(selectAll()),
        clearSelection: () => dispatch(clearSelection()),
        clearAll: () => dispatch({
            type: SELECT_ENTITY,
            payload: { clearAll: true }
        })
    };
};

export { SystemsTable };
export const SystemsTableWithApollo = withApollo(SystemsTable);
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SystemsTableWithApollo);
