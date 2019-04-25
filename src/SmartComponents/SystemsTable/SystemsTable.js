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

@registry()
class SystemsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <EmptyTable><Spinner/></EmptyTable>,
            items: this.props.items,
            filterEnabled: false,
            meta: {
                page: 1,
                perPage: 50,
                totalItems: this.props.items.length
            }
        };

        this.fetchInventory = this.fetchInventory.bind(this);
        this.fetchInventory();
    }

    onRefresh = (items, filterEnabled) => {
        this.setState({ items, filterEnabled });
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
        const { items, meta, InventoryCmp } = this.state;

        return (
            <InventoryCmp
                page={meta.page}
                total={meta.totalItems}
                perPage={meta.perPage}
                items={items.map(host => host.id)}
            >
                <reactCore.ToolbarGroup>
                    <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--lg)' }}>
                        <SystemsComplianceFilter onRefresh={this.onRefresh} />
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
    items: propTypes.array,
    columns: propTypes.array
};

export default SystemsTable;
