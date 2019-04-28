import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import propTypes from 'prop-types';
import { entitiesReducer } from '../../store/Reducers/SystemStore';
import DownloadTableButton from '../DownloadTableButton/DownloadTableButton';
import ComplianceRemediationButton from '../ComplianceRemediationButton/ComplianceRemediationButton';
import SystemsComplianceFilter from '../SystemsComplianceFilter/SystemsComplianceFilter';
import { registry, EmptyTable, Spinner } from '@red-hat-insights/insights-frontend-components';
import { PaginationRow } from 'patternfly-react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const GET_SYSTEMS = gql`
query getSystems($filter: String!, $perPage: Int, $page: Int) {
    allSystems(search: $filter, per_page: $perPage, page: $page) { id }
}
`;

@registry()
class SystemsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <EmptyTable><Spinner/></EmptyTable>,
            items: this.props.items.slice(0, 50),
            filterEnabled: false,
            filter: '',
            page: 1,
            perPage: 50,
            totalItems: this.props.items.length
        };

        this.fetchInventory = this.fetchInventory.bind(this);
        this.fetchInventory();
    }

    onRefresh = ({ page, per_page: perPage }) => {
        this.setState({ page, perPage }, this.systemFetch);
    }

    updateFilter = (filter, filterEnabled) => {
        this.setState({ filter, filterEnabled }, this.systemFetch);
    }

    systemFetch = () => {
        const { client } = this.props;
        const { filter, perPage, page } = this.state;
        client.query({ query: GET_SYSTEMS, variables: { filter, perPage, page } })
        .then((items) => {
            this.setState({
                page,
                perPage,
                items: items.data.allSystems
            });
        });

    }

    async fetchInventory() {
        const { items } = this.state;
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
            pfReact: { PaginationRow }
        });

        this.getRegistry().register({
            ...mergeWithEntities(
                entitiesReducer(
                    INVENTORY_ACTION_TYPES, items, columns
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
    items: propTypes.array,
    columns: propTypes.array
};

export default withApollo(SystemsTable);
