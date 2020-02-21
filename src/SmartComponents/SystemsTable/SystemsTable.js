import React from 'react';
import propTypes from 'prop-types';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
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
} from '../../SmartComponents';
import { exportToCSV } from '../../store/ActionTypes.js';
import { exportToJson } from 'Utilities/Export';
import { buildFilterString } from 'Utilities/FilterBuilder';
import { FilterConfigBuilder } from 'Utilities/FilterConfigBuilder';
import { stringToId } from 'Utilities/TextHelper';
import { entitiesReducer } from '../../store/Reducers/SystemStore';
import { FILTER_CONFIGURATION } from '../../constants';
const DEBOUNCE_TIME = 600;

export const GET_SYSTEMS = gql`
query getSystems($filter: String!, $perPage: Int, $page: Int) {
    systems(search: $filter, limit: $perPage, offset: $page) {
        totalCount,
        edges {
            node {
                id
                name
                profiles {
                    name,
                    rulesPassed
                    rulesFailed
                    lastScanned
                    compliant
                }
                ruleObjectsFailed {
                    refId,
                    profiles {
                        refId
                    }
                    title,
                    remediationAvailable
                }
            }
        }
    }
}
`;

@registry()
class SystemsTable extends React.Component {
    inventory = React.createRef();
    filterConfig = new FilterConfigBuilder(FILTER_CONFIGURATION);

    state = {
        InventoryCmp: () => <SkeletonTable colSize={2} rowSize={15} />,
        items: [],
        policyId: this.props.policyId,
        page: 1,
        perPage: 50,
        totalCount: 0,
        activeFilters: this.filterConfig.initialDefaultState(),
        filterChips: []
    }

    componentDidMount = () => {
        this.fetchInventory();
    }

    onRefresh = ({ page, per_page: perPage }) => {
        this.setState({ page, perPage }, this.systemFetch);
    }

    systemFetch = () => {
        const { client } = this.props;
        const { policyId, perPage, page } = this.state;
        const filter = buildFilterString(this.state);

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

    updateFilter = (filter, selectedValues) => {
        this.setState({
            ...this.state,
            loaded: false,
            items: []
        }, () => {
            this.updateComplianceFilter(filter, selectedValues);
        });
    }

    updateComplianceFilter = (filter, selectedValues) => {
        this.setState({
            ...this.state,
            loaded: false,
            items: [],
            page: 1,
            activeFilters: {
                ...this.state.activeFilters,
                [filter]: selectedValues
            }
        }, this.filterUpdate);
    }

    filterUpdate = debounce(() => {
        this.updateFilterChips();
        this.systemFetch();
    }, DEBOUNCE_TIME)

    filterChip = (chips) => {
        const chipCategory = chips.category;
        const chipName = chips.chips[0].name;
        return this.state.filterChips.map((chips) => {
            if (chips.category !== chipCategory) {
                return chips;
            }

            const freshChips = chips.chips.filter((c) => c.name !== chipName);
            return freshChips.length > 0 ? { ...chips, chips: freshChips } : null;
        }).filter((c) => (!!c));
    }

    updatedChips = (filter) => {
        const currentFilter = this.state.activeFilters[filter];
        if (typeof(currentFilter) === 'string' && currentFilter !== '') {
            return {
                category: 'Name',
                chips: [{ name: currentFilter }]
            };
        } else if (currentFilter && currentFilter.length > 0) {
            const category = this.filterConfig.categoryLabelForValue(currentFilter[0]);
            return {
                category,
                chips: currentFilter.map((value) => (
                    { name: this.filterConfig.labelForValue(value, category) }
                ))
            };
        } else {
            return null;
        }
    }

    updateFilterChips = () => {
        let newChips = Object.keys(this.state.activeFilters).map((filter) => (
            this.updatedChips(filter)
        )).filter((f) => (!!f));

        this.setState({
            filterChips: newChips
        });
    }

    deleteComplianceFilter = (chips) => {
        const chipCategory = chips.category;
        const chipName = chips.chips[0].name;
        const chipValue = this.filterConfig.valueForLabel(chipName, chipCategory);
        const stateProp = stringToId(chipCategory);
        const currentState = this.state.activeFilters[stateProp];
        let newFilterState;
        if (typeof(currentState) === 'string') {
            newFilterState = '';
        } else {
            newFilterState = currentState.filter((value) =>
                value !== chipValue
            );
        }

        const freshChips = this.filterChip(chips);

        this.setState({
            loaded: false,
            items: [],
            activeFilters: {
                ...this.state.activeFilters,
                [stateProp]: newFilterState
            },
            filterChips: freshChips
        }, this.systemFetch);
    }

    onFilterDelete = (_event, chips, clearAll = false) => {
        if (clearAll) {
            this.clearAllFilter();
            return;
        }

        this.deleteComplianceFilter(chips);
    }

    clearAllFilter = () => {
        this.setState({
            items: [],
            loaded: false,
            activeFilters: this.filterConfig.initialDefaultState(),
            filterChips: []
        }, this.filterUpdate);
    }

    async fetchInventory() {
        const { columns } = this.props;
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
                    INVENTORY_ACTION_TYPES, () => this.state.items, columns, this.isGraphqlFinished, this.props.allSystems
                ))
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable
        });
    }

    render() {
        const { remediationsEnabled, compact, enableExport } = this.props;
        const {
            page, totalCount, perPage, items, InventoryCmp, filterChips, allSystems,
            selectedSystemId, selectedSystemFqdn, isAssignPoliciesModalOpen } = this.state;
        const filterConfig = this.filterConfig.buildConfiguration(
            this.updateFilter,
            this.state.activeFilters,
            { hideLabel: true }
        );
        const exportConfig = enableExport ? { onSelect: this.onExportSelect } : {};

        return <InventoryCmp
            actions={[
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
                        window.location.href = `${window.location.origin}/rhel/inventory/${id}`;
                    }
                }
            ]}
            onRefresh={ this.onRefresh }
            page={ page }
            ref={ this.inventory }
            total={totalCount}
            perPage={ perPage }
            variant={ compact ? pfReactTable.TableVariant.compact : null }
            items={ allSystems ? undefined : items.map((edge) => edge.node.id) }
            filterConfig={ filterConfig }
            exportConfig={ exportConfig }
            activeFiltersConfig={{
                filters: filterChips,
                onDelete: this.onFilterDelete
            }}>
            { !allSystems && <reactCore.ToolbarGroup>
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
                toggle={() => this.setState((prev) => ({ isAssignPoliciesModalOpen: !prev.isAssignPoliciesModalOpen }))}
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
    allSystems: propTypes.bool
};

SystemsTable.defaultProps = {
    policyId: '',
    remediationsEnabled: true,
    compact: false,
    enableExport: true,
    allSystems: false
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
export const SystemsTableWithApollo = withApollo(SystemsTable, { withRef: true });
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SystemsTableWithApollo);
