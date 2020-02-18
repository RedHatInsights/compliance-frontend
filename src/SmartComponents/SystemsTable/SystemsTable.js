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
    SkeletonTable,
    conditionalFilterType
} from '@redhat-cloud-services/frontend-components';
import {
    ComplianceRemediationButton
} from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { COMPLIANCE_API_ROOT } from '../../constants';
import registry from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { exportToCSV } from '../../store/ActionTypes.js';
import { linkAndDownload, filename as formatFilename } from 'Utilities/CsvExport';
import { isNumberRange } from 'Utilities/TextHelper';
import { entitiesReducer } from '../../store/Reducers/SystemStore';

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
    state = {
        InventoryCmp: () => <SkeletonTable colSize={2} rowSize={15} />,
        items: [],
        search: '',
        policyId: this.props.policyId,
        page: 1,
        perPage: 50,
        totalCount: 0,
		isAssignPoliciesModalOpen: false,
        activeFilters: {
            complianceScores: [],
            complianceStates: [],
            chips: []
        }
    }

    componentDidMount = () => {
        this.fetchInventory();
    }

    buildFilter = () => {
        const { policyId, search } = this.state;
        let result = this.buildFilterString();

        result = this.appendToFilter(result, 'profile_id', '=', policyId);
        result = this.appendToFilter(result, 'name', '~', search);

        return result;
    }

    buildFilterString = () => {
        const compliant = this.state.activeFilters.complianceStates;
        const complianceScore = this.state.activeFilters.complianceScores;

        let filter = '';

        compliant.forEach((compliant) => {
            if (filter !== '') {
                filter += (' or ');
            }

            filter += ('compliant = ' + compliant);
        });

        complianceScore.forEach((scoreRange, index) => {
            if (index === 0 && filter !== '') { filter += ' and '; }

            if (index !== 0 && filter !== '') { filter += ' or '; }

            scoreRange = scoreRange.split('-');
            filter += ('compliance_score >= ' + scoreRange[0] +
                       ' and compliance_score <= ' + scoreRange[1]);
        });

        return filter;
    }

    appendToFilter = (filter, attribute, operation, append) => {
        if (append && append.length > 0) {
            if (filter.length > 0) {
                filter += ' and ';
            }

            filter += `${attribute} ${operation} ${append}`;
        }

        return filter;
    }

    onRefresh = ({ page, per_page: perPage }) => {
        this.setState({ page, perPage }, this.systemFetch);
    }

    systemFetch = () => {
        const { client } = this.props;
        const { policyId, perPage, page } = this.state;
        const filter = this.buildFilter();

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

    exportToJson = () => {
        linkAndDownload((this.props.selectedEntities !== null) ?
            COMPLIANCE_API_ROOT + '/systems.json' +
            '?search=(id ^ (' + this.props.selectedEntities.join(',') + '))' : '',
        formatFilename('json'));
    }

    onExportSelect = (_, format) => {
        if (format === 'csv') {
            this.props.exportToCSV();
        }

        if (format === 'json') {
            this.exportToJson();
        }
    }

    onFilterChange = debounce((_event, selectedValues, value) => {
        if (value) {
            const filterToSet = isNumberRange(value) ? 'complianceScores' : 'complianceStates';
            this.setState({
                ...this.state,
                activeFilters: {
                    ...this.state.activeFilters,
                    [filterToSet]: selectedValues
                }
            }, () => {
                this.updateFilterChips();
                this.systemFetch();
            });
        } else {
            this.setState({
                ...this.state,
                search: selectedValues
            }, () => {
                this.updateFilterChips();
                this.systemFetch();
            });
        }
    }, 500)

    onFilterDelete = (_event, chips, clearAll = false) => {
        if (clearAll) {
            this.setState({
                activeFilters: {
                    complianceStates: [],
                    complianceScores: [],
                    chips: []
                }
            }, this.systemFetch);
            return;
        }

        switch (chips.category) {
            case 'Name or reference':
                this.setState({
                    search: '',
                    activeFilters: {
                        ...this.state.activeFilters,
                        chips: this.state.activeFilters.chips.filter((chips) => (chips.category !== 'Name or reference'))
                    }
                },  this.systemFetch);
                break;
            case 'Compliant':
                this.setState({
                    activeFilters: {
                        ...this.state.activeFilters,
                        complianceStates: [],
                        chips: this.state.activeFilters.chips.filter((chips) => (chips.category !== 'Compliant'))
                    }
                }, () => {
                    this.systemFetch();
                });
                break;
            case 'Compliance Score':
                this.setState({
                    activeFilters: {
                        ...this.state.activeFilters,
                        complianceScores: [],
                        chips: this.state.activeFilters.chips.filter((chips) => (chips.category !== 'Compliance Score'))
                    }
                },  this.systemFetch);
                break;
            default:
                return;
        }
    }

    updateFilterChips = () => {
        const { complianceStates: compliant, complianceScores } = this.state.activeFilters;
        const { search } = this.state;
        let newChips = [];

        if (search !== '') {
            newChips = [
                ...newChips,
                {
                    category: 'Name or reference',
                    chips: [{ name: search }]
                }
            ];
        }

        if (compliant.length > 0) {
            newChips = [
                ...newChips,
                {
                    category: 'Compliant',
                    chips: compliant.map((complianceCondition) => ({ name: complianceCondition }))
                }
            ];
        }

        if (complianceScores.length > 0) {
            newChips = [
                ...newChips,
                {
                    category: 'Compliance Score',
                    chips: complianceScores.map((complianceScore) => ({ name: complianceScore }))
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

        const filterConfig = {
            items: [
                {
                    type: conditionalFilterType.text,
                    label: 'Name or reference',
                    filterValues: {
                        onSubmit: this.onFilterChange,
                        value: search
                    }
                },
                {
                    type: 'checkbox',
                    label: 'Compliant',
                    id: 'compliant',
                    filterValues: {
                        onChange: this.onFilterChange,
                        value: complianceStates,
                        items: [
                            { label: 'Compliant', value: 'compliant' },
                            { label: 'Non-compliant', value: 'noncompliant' }
                        ]
                    }
                },
                {
                    type: 'checkbox',
                    label: 'Compliance score',
                    id: 'complianceScore',
                    filterValues: {
                        onChange: this.onFilterChange,
                        value: complianceScores,
                        items: [
                            { label: '90 - 100%', value: '90-100' },
                            { label: '70 - 89%', value: '70-89' },
                            { label: '50 - 69%', value: '50-69' },
                            { label: 'Less than 50%', value: '0-49' }
                        ]
                    }
                }
            ]
        };


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
    exportToCSV: propTypes.func
};

SystemsTable.defaultProps = {
    policyId: '',
    remediationsEnabled: true,
    compact: false
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
export default connect(
    mapStateToProps,
    mapDispatchToProps)(withApollo(SystemsTable, { withRef: true })
);
