import React from 'react';
import { connect } from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import propTypes from 'prop-types';
import { entitiesReducer } from '../../store/Reducers/SystemStore';
import DownloadTableButton from '../DownloadTableButton/DownloadTableButton';
import ComplianceRemediationButton from '../ComplianceRemediationButton/ComplianceRemediationButton';
import { registry } from '@red-hat-insights/insights-frontend-components';
import { PaginationRow } from 'patternfly-react';

@registry()
class SystemsTable extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
            InventoryCmp: () => <div>Loading...</div>,
            items: [{
                id: 'ed9b9afd-4490-4ba8-b1a5-af63fd34c124',
                children: [1], // please select some kind of more specific ID
                active: false // to indicate that parent is not expanded
            }, {
                account: true, // since inventory table is checking if account is set
                isOpen: false,
                title: <div>Blaaa</div> // What to show in expanded row
            }]
        };

        this.fetchInventory = this.fetchInventory.bind(this);
        this.onExpandClick = this.onExpandClick.bind(this);
        this.fetchInventory();
    }

    async fetchInventory() {
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
                    INVENTORY_ACTION_TYPES, this.props.items, this.props.columns
                ))
        });

        const { InventoryTable, updateEntities } = inventoryConnector();
        this.updateEntities = updateEntities;
        this.setState({
            InventoryCmp: InventoryTable
        });
    }

    onExpandClick(_cell, row, key) {
        const { items } = this.state;
        items.find(item => item.id === key).active = !row.active;
        // Not ideal, but for the sake of example it's fine
        row.children.forEach(child => {
            items.find(item => item.id === child.id).isOpen = !row.active;
        });
        this.setState({
            items
        });
        this.context.store.dispatch(this.updateEntities(items));
    }

    render() {
        const { InventoryCmp, items } = this.state;
        // concatenate the names of profiles
        // let hosts = [{ id: '19200f9f-dd49-4ec9-ac91-83009ec0acec', profiles: 'profile 1, profile 2', compliant: 'true' }];
        // Ideally change items to look like the right Entities format
        return (
            <reactCore.Card>
                <reactCore.CardHeader>
                    <DownloadTableButton />
                    <ComplianceRemediationButton />
                </reactCore.CardHeader>
                <reactCore.CardBody>
                    { this.props.expandable ?
                        <InventoryCmp items={items} expandable={true} onExpandClick={this.onExpandClick} /> :
                        <InventoryCmp/> }
                </reactCore.CardBody>
            </reactCore.Card>
        );
    }
}

SystemsTable.contextTypes = {
    store: propTypes.object
};

SystemsTable.propTypes = {
    items: propTypes.array,
    columns: propTypes.array,
    expandable: propTypes.bool
};

SystemsTable.defaultProps = {
    expandable: false
};

export default connect(() => ({}))(SystemsTable);
