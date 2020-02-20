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
import { exportToCSV } from '../../store/ActionTypes.js';
import { exportToJson } from 'Utilities/Export';
import { isNumberRange } from 'Utilities/TextHelper';
import { buildFilterString } from 'Utilities/FilterBuilder';

import { entitiesReducer } from '../../store/Reducers/SystemStore';
import { defaultFilterConfig, labelForValue } from './filterConfig';

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
    initialFilter = {
        complianceScores: [],
        complianceStates: [],
        chips: []
    }
    state = {
        InventoryCmp: () => <SkeletonTable colSize={2} rowSize={15} />,
        items: [],
        search: '',
        policyId: this.props.policyId,
        page: 1,
        perPage: 50,
        totalCount: 0,
        activeFilters: this.initialFilter
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

    updateSearchFilter = debounce((_event, selectedValue) => {
        this.setState({
            ...this.state,
            page: 1,
            search: selectedValue
        }, this.filterUpdate);
    }, 500)

    updateComplianceFilter = debounce((_event, selectedValues, value) => {
        const filterToSet = isNumberRange(value) ? 'complianceScores' : 'complianceStates';
        this.setState({
            ...this.state,
            page: 1,
            activeFilters: {
                ...this.state.activeFilters,
                [filterToSet]: selectedValues
            }
        }, this.filterUpdate);
    }, 500)

    filterUpdate = () => {
        this.updateFilterChips();
        this.systemFetch();
    }

    deleteSearchFilter = () => {
        this.setState({
            search: '',
            activeFilters: {
                ...this.state.activeFilters,
                chips: this.state.activeFilters.chips.filter((chips) => (chips.category !== 'Name'))
            }
        },  this.systemFetch);
    }

    deleteComplianceFilter = (chips) => {
        const chipCategory = chips.category;
        const stateProp = chipCategory === 'Compliant' ? 'complianceStates' : 'complianceScores';
        const chipName = chips.chips[0].name;

        this.setState({
            activeFilters: {
                ...this.state.activeFilters,
                [stateProp]: this.state.activeFilters[stateProp].filter((value) => value !== chipName),
                chips: this.state.activeFilters.chips.map((chips) => {
                    if (chips.category !== chipCategory) {
                        return chips;
                    }

                    const freshChips = chips.chips.filter((c) => c.name !== chipName);
                    return freshChips.length > 0 ? { ...chips, chips: freshChips } : null;
                }).filter((c) => (!!c))
            }
        }, this.systemFetch);
    }

    clearAllFilter = () => {
        this.setState({
            activeFilters: this.initialFilter
        }, this.systemFetch);
    }

    onFilterDelete = debounce((_event, chips, clearAll = false) => {
        if (clearAll) {
            this.clearAllFilter();
            return;
        }

        if (chips.category === 'Name') {
            this.deleteSearchFilter(chips);
        } else {
            this.deleteComplianceFilter(chips);
        }
    }, 500)

    updateFilterChips = () => {
        const { complianceStates: compliant, complianceScores } = this.state.activeFilters;
        const { search } = this.state;
        let newChips = [];
        let category;

        if (search !== '') {
            newChips = [
                ...newChips,
                {
                    category: 'Name',
                    chips: [{ name: search }]
                }
            ];
        }

        if (compliant && compliant.length > 0) {
            category = 'Compliant';
            newChips = [
                ...newChips,
                {
                    category,
                    chips: compliant.map((complianceCondition) => (
                        { name: labelForValue(complianceCondition, category) }
                    ))
                }
            ];
        }

        if (complianceScores && complianceScores.length > 0) {
            category = 'Compliance score';
            newChips = [
                ...newChips,
                {
                    category,
                    chips: complianceScores.map((complianceScore) => (
                        { name: labelForValue(complianceScore, category) }
                    ))
                }
            ];
        }

        this.setState({
            activeFilters: {
                ...this.state.activeFilters,
                chips: newChips
            }
        });
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
        const { remediationsEnabled, compact, allSystems } = this.props;
        const { page, totalCount, perPage, items, InventoryCmp,
            selectedSystemId, selectedSystemFqdn, isAssignPoliciesModalOpen
        } = this.state;
		const { complianceScores, complianceStates } = this.state.activeFilters;

        return <InventoryCmp
            onRefresh={this.onRefresh}
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
            page={page}
            ref={this.inventory}
            total={totalCount}
            perPage={perPage}
            variant={compact ? pfReactTable.TableVariant.compact : null}
            items={items.map((edge) => edge.node.id)}
			filterConfig={ filterConfig }
            activeFiltersConfig={ activeFiltersConfig }
            exportConfig={{
                onSelect: this.onExportSelect
            }}
            activeFiltersConfig={{
                filters: this.state.activeFilters.chips,
                onDelete: this.onFilterDelete
            }}>
            <reactCore.ToolbarGroup>
                { remediationsEnabled &&
                    <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--lg)' }}>
                        <ComplianceRemediationButton
                            allSystems={ items.map((edge) => edge.node) }
                            selectedRules={ [] } />
                    </reactCore.ToolbarItem>
                }
            </reactCore.ToolbarGroup>
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
    enableExport: propTypes.bool
};

SystemsTable.defaultProps = {
    policyId: '',
    remediationsEnabled: true,
    compact: false,
    enableExport: true
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
