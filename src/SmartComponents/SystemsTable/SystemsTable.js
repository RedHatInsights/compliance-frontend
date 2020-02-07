import React from 'react';
import propTypes from 'prop-types';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import { withApollo } from 'react-apollo';
import debounce from 'lodash/debounce';
import gql from 'graphql-tag';

import {
    SimpleTableFilter,
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import {
    ComplianceRemediationButton
} from '@redhat-cloud-services/frontend-components-inventory-compliance';
import registry from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

import { entitiesReducer } from '../../store/Reducers/SystemStore';
import  {
    DownloadTableButton
} from '../../SmartComponents';
import {
    SystemsComplianceFilter
} from '../../PresentationalComponents';

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
    state = {
        InventoryCmp: () => <SkeletonTable colSize={2} rowSize={15} />,
        items: this.props.items,
        filterEnabled: this.props.filterEnabled,
        filter: this.props.filter,
        search: '',
        policyId: this.props.policyId,
        page: 1,
        perPage: 50,
        totalCount: 0
    };

    componentDidMount = () => {
        this.fetchInventory();
    }

    buildFilter = () => {
        const { policyId, filter, search } = this.state;
        let result = filter;
        result = this.appendToFilter(result, 'profile_id', '=', policyId);
        result = this.appendToFilter(result, 'name', '~', search);
        return result;
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

    updateFilter = (filter, filterEnabled) => {
        this.setState({ filter, filterEnabled }, this.systemFetch);
    }

    handleSearch = debounce(search => {
        this.setState({ search, page: 1 }, this.systemFetch);
    }, 500)

    systemFetch = () => {
        const { client } = this.props;
        const { policyId, perPage, page } = this.state;
        return client.query({ query: GET_SYSTEMS, fetchResults: true, fetchPolicy: 'no-cache',
            variables: { filter: this.buildFilter(), perPage, page, policyId } })
        .then((items) => {
            this.setState({
                page,
                perPage,
                items: items.data.systems.edges,
                totalCount: items.data.systems.totalCount,
                loaded: true
            });
        });
    }

    isGraphqlFinished = () => (
        this.state.loaded
    )

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
                    INVENTORY_ACTION_TYPES, () => this.state.items, columns, this.isGraphqlFinished
                ))
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable
        });
    }

    render() {
        const { remediationsEnabled, compact } = this.props;
        const { page, totalCount, perPage, items, InventoryCmp } = this.state;

        return <InventoryCmp
            onRefresh={this.onRefresh}
            page={page}
            total={totalCount}
            perPage={perPage}
            variant={compact ? pfReactTable.TableVariant.compact : null}
            items={items.map((edge) => edge.node.id)}
        >
            <reactCore.ToolbarGroup>
                <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--lg)' }}>
                    <reactCore.InputGroup>
                        <SystemsComplianceFilter updateFilter={this.updateFilter}/>
                        <SimpleTableFilter buttonTitle={null}
                            onFilterChange={this.handleSearch}
                            placeholder="Search by name" />
                    </reactCore.InputGroup>
                </reactCore.ToolbarItem>
                { remediationsEnabled &&
                    <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--lg)' }}>
                        <ComplianceRemediationButton
                            allSystems={ items.map((edge) => edge.node) }
                            selectedRules={ [] } />
                    </reactCore.ToolbarItem>
                }
                <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--md)' }}>
                    <DownloadTableButton />
                </reactCore.ToolbarItem>
            </reactCore.ToolbarGroup>
        </InventoryCmp>;
    }
}

SystemsTable.propTypes = {
    client: propTypes.object,
    filter: propTypes.string,
    filterEnabled: propTypes.bool,
    policyId: propTypes.string,
    items: propTypes.array,
    columns: propTypes.array,
    remediationsEnabled: propTypes.bool,
    compact: propTypes.bool
};

SystemsTable.defaultProps = {
    items: [],
    policyId: '',
    filter: '',
    filterEnabled: false,
    remediationsEnabled: true,
    compact: false
};

export { SystemsTable };
export default withApollo(SystemsTable, { withRef: true });
