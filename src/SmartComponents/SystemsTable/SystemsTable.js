import React from 'react';
import propTypes from 'prop-types';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import { withApollo } from '@apollo/react-hoc';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import debounce from 'lodash/debounce';
import {
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import {
    ComplianceRemediationButton
} from '@redhat-cloud-services/frontend-components-inventory-compliance';
import registry from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import  {
    AssignPoliciesModal
} from '../../SmartComponents';
import { exportToCSV } from '../../store/ActionTypes.js';
import { exportToJson } from 'Utilities/Export';
import { FilterConfigBuilder } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { entitiesReducer } from '../../store/Reducers/SystemStore';
import { FILTER_CONFIGURATION } from '../../constants';

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
                    rulesPassed
                    rulesFailed
                    lastScanned
                    compliant
                    score
                }
                ruleObjectsFailed {
                    refId
                    profiles {
                        refId
                    }
                    title
                    remediationAvailable
                }
            }
        }
    }
}
`;

const loadingState = {
    loaded: false,
    items: [],
    page: 1
};

@registry()
class SystemsTable extends React.Component {
    inventory = React.createRef();
    filterConfig = new FilterConfigBuilder(FILTER_CONFIGURATION);
    chipBuilder = this.filterConfig.getChipBuilder();
    filterBuilder = this.filterConfig.getFilterBuilder();

    state = {
        ...loadingState,
        InventoryCmp: React.forwardRef((_, ref) => <SkeletonTable ref={ref} colSize={2} rowSize={15} />), // eslint-disable-line
        policyId: this.props.policyId,
        perPage: 50,
        totalCount: 0,
        activeFilters: this.filterConfig.initialDefaultState()
    }

    componentDidMount = () => {
        this.fetchInventory();
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.complianceThreshold !== this.props.complianceThreshold) {
            this.systemFetch();
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
            this.setState({ page, perPage }, this.systemFetch);
        }
    }

    systemFetch = () => {
        const { client, showOnlySystemsWithTestResults } = this.props;
        const { policyId, perPage, page, activeFilters } = this.state;
        let filter = this.filterBuilder.buildFilterString(activeFilters);

        if (showOnlySystemsWithTestResults) {
            filter = `has_test_results = true ${filter.length > 0 ? `and ${filter}` : ''}`;
        }

        if (policyId && policyId.length > 0) {
            filter = `profile_id = ${policyId} and ${filter}`;
        }

        return client.query({
            query: GET_SYSTEMS,
            fetchResults: true,
            fetchPolicy: 'no-cache',
            variables: { filter, perPage, page, policyId }
        }).then((items) => {
            this.setState({
                page,
                perPage,
                items: items.data.systems.edges,
                totalCount: items.data.systems.totalCount,
                loaded: true
            }, () => {
                // If the items in the table are the same after two GQL calls,
                // e.g: if you try to load 19 items for a perPage of 20 items, then
                // change perPage to 50 items - the Inventory will not trigger a call
                // to the Inventory API, and the table will remain on a loading state.
                // To avoid this, we call refresh manually on such cases.
                if (items.data.systems.totalCount <= perPage) {
                    this.inventory.current && this.inventory.current.onRefreshData();
                }
            });
        });
    }

    isGraphqlFinished = () => (
        this.state.loaded
    )

    onExportSelect = (_, format) => {
        const { exportToCSV, selectedEntities } = this.props;

        if (format === 'csv') {
            exportToCSV();
        } else if (format === 'json') {
            exportToJson(selectedEntities);
        }
    }

    onFilterUpdate = debounce((filter, selectedValues) => {
        this.setState({
            ...loadingState,
            activeFilters: {
                ...this.state.activeFilters,
                [filter]: selectedValues
            }
        }, this.systemFetch);
    }, 500)

    deleteFilter = (chips) => {
        const activeFilters =  this.filterConfig.removeFilterWithChip(
            chips, this.state.activeFilters
        );
        this.setState({
            activeFilters
        }, this.systemFetch);
    }

    clearAllFilter = () => {
        this.setState({
            ...loadingState,
            activeFilters: this.filterConfig.initialDefaultState()
        }, this.systemFetch);
    }

    onFilterDelete = debounce((_event, chips, clearAll = false) => {
        clearAll ? this.clearAllFilter() : this.deleteFilter(chips[0]);
    }, 500)

    async fetchInventory() {
        const { columns, policyId, showAllSystems } = this.props;
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

        this.getRegistry().register({
            ...mergeWithEntities(
                entitiesReducer(
                    INVENTORY_ACTION_TYPES, () => this.state.items, columns, this.isGraphqlFinished, showAllSystems, policyId
                ))
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable
        });
    }

    render() {
        const { remediationsEnabled, compact, enableExport, showAllSystems, showActions } = this.props;
        const {
            page, totalCount, perPage, items, InventoryCmp, selectedSystemId,
            selectedSystemFqdn, isAssignPoliciesModalOpen
        } = this.state;
        const filterConfig = this.filterConfig.buildConfiguration(
            this.onFilterUpdate,
            this.state.activeFilters,
            { hideLabel: true }
        );
        const filterChips = this.chipBuilder.chipsFor(this.state.activeFilters);
        const exportConfig = enableExport ? { onSelect: this.onExportSelect } : {};
        const inventoryTableProps = {
            onRefresh: this.onRefresh,
            ref: this.inventory,
            page,
            perPage,
            exportConfig
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
                        window.location.href = `${window.location.origin}${beta ? '/beta' : ''}/rhel/inventory/${id}`;
                    }
                }
            ];
        }

        if (!showAllSystems) {
            inventoryTableProps.total = totalCount;
            inventoryTableProps.items = items.map((edge) => edge.node.id);
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
                            allSystems={ items.map((edge) => edge.node) }
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
                    ), !closedOrCanceled ? this.systemFetch : null);
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
    exportToCSV: propTypes.func,
    enableExport: propTypes.bool,
    showAllSystems: propTypes.bool,
    complianceThreshold: propTypes.number,
    showOnlySystemsWithTestResults: propTypes.bool,
    showActions: propTypes.bool
};

SystemsTable.defaultProps = {
    policyId: '',
    remediationsEnabled: true,
    compact: false,
    enableExport: true,
    showAllSystems: false,
    complianceThreshold: 0,
    showOnlySystemsWithTestResults: false,
    showActions: true
};

const mapStateToProps = state => {
    if (state.entities === undefined || state.entities.rows === undefined) {
        return { selectedEntities: [] };
    }

    return {
        selectedEntities: state.entities.rows.
        filter(entity => entity.selected).
        map(entity => entity.id)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        exportToCSV: event => dispatch(exportToCSV(event))
    };
};

export { SystemsTable };
export const SystemsTableWithApollo = withApollo(SystemsTable);
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SystemsTableWithApollo);
