import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import propTypes from 'prop-types';
import { entitiesReducer } from '../../store/Reducers/SystemStore';
import DownloadTableButton from '../DownloadTableButton/DownloadTableButton';
import ComplianceRemediationButton from '../ComplianceRemediationButton/ComplianceRemediationButton';
import SystemsComplianceFilter from '../SystemsComplianceFilter/SystemsComplianceFilter';
import { EmptyTable, Spinner } from '@redhat-cloud-services/frontend-components';
import registry from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const GET_SYSTEMS = gql`
query getSystems($filter: String!, $perPage: Int, $page: Int, $policyId: String) {
    allSystems(search: $filter, perPage: $perPage, page: $page, profileId: $policyId) {
        id
        name
        profileNames
        rulesPassed(profileId: $policyId)
        rulesFailed(profileId: $policyId)
        lastScanned(profileId: $policyId)
        compliant(profileId: $policyId)
    }
}
`;

@registry()
class SystemsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <EmptyTable><Spinner/></EmptyTable>,
            items: this.props.items,
            filterEnabled: this.props.filterEnabled,
            filter: this.props.filter,
            policyId: this.props.policyId,
            page: 1,
            perPage: 50,
            totalItems: this.props.systemsCount
        };

        if (this.state.items === []) { this.systemFetch(); }

        this.fetchInventory = this.fetchInventory.bind(this);
        this.fetchInventory();
    }

    buildFilter = () => {
        const { policyId, filter } = this.state;
        return (!policyId || policyId.length === 0) ? filter : `profile_id = ${policyId} and ${filter}`;
    }

    onRefresh = ({ page, per_page: perPage }) => {
        this.setState({ page, perPage }, this.systemFetch);
    }

    updateFilter = (filter, filterEnabled) => {
        this.setState({ filter, filterEnabled }, this.systemFetch);
    }

    systemFetch = () => {
        const { client } = this.props;
        const { policyId, perPage, page } = this.state;
        client.query({ query: GET_SYSTEMS, variables: { filter: this.buildFilter(), perPage, page, policyId } })
        .then((items) => {
            this.setState({
                page,
                perPage,
                items: items.data.allSystems
            });
        });

    }

    async fetchInventory() {
        const { columns } = this.props ;

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
                    INVENTORY_ACTION_TYPES, () => this.state.items, columns
                ))
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable
        });
    }

    render() {
        const { page, totalItems, perPage, items, InventoryCmp } = this.state;

        return (
            <InventoryCmp
                onRefresh={this.onRefresh}
                page={page}
                total={totalItems}
                perPage={perPage}
                items={items.map(host => host.id)}
            >
                <reactCore.ToolbarGroup>
                    <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--lg)' }}>
                        <SystemsComplianceFilter updateFilter={this.updateFilter} />
                    </reactCore.ToolbarItem>
                    <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--lg)' }}>
                        <ComplianceRemediationButton />
                    </reactCore.ToolbarItem>
                    <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--md)' }}>
                        <DownloadTableButton />
                    </reactCore.ToolbarItem>
                </reactCore.ToolbarGroup>
            </InventoryCmp>
        );
    }
}

SystemsTable.propTypes = {
    client: propTypes.object,
    filter: propTypes.string,
    filterEnabled: propTypes.bool,
    policyId: propTypes.string,
    items: propTypes.array,
    columns: propTypes.array,
    systemsCount: propTypes.number
};

SystemsTable.defaultProps = {
    items: [],
    systemsCount: 0,
    policyId: '',
    filter: '',
    filterEnabled: false
};

export default withApollo(SystemsTable);
