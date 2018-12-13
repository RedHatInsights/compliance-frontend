import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import propTypes from 'prop-types';
import { entitiesDetailReducer } from '../../store/Reducers/SystemStore';
import DownloadTableButton from '../DownloadTableButton/DownloadTableButton';
import { registry as registryDecorator } from '@red-hat-insights/insights-frontend-components';

@registryDecorator()
class SystemsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <div>Loading...</div>
        };

        this.fetchInventory = this.fetchInventory.bind(this);
        this.fetchInventory();
    }

    async fetchInventory() {
        const {
            inventoryConnector,
            INVENTORY_ACTION_TYPES,
            mergeWithEntities,
            mergeWithDetail
        } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons
        });

        this.getRegistry().register({
            ...mergeWithEntities(
                entitiesDetailReducer(
                    INVENTORY_ACTION_TYPES, this.props.items, this.props.columns
                )),
            ...mergeWithDetail()
        });

        this.setState({
            InventoryCmp: inventoryConnector()
        });
    }

    render() {
        const { InventoryCmp } = this.state;
        //const items = this.props.items;
        // concatenate the names of profiles
        // let hosts = [{ id: '19200f9f-dd49-4ec9-ac91-83009ec0acec', profiles: 'profile 1, profile 2', compliant: 'true' }];
        // Ideally change items to look like the right Entities format
        return (
            <reactCore.Card>
                <reactCore.CardHeader>
                    <DownloadTableButton />
                </reactCore.CardHeader>
                <reactCore.CardBody>
                    <InventoryCmp />
                </reactCore.CardBody>
            </reactCore.Card>
        );
    }
}

SystemsTable.propTypes = {
    items: propTypes.array,
    columns: propTypes.array
};

export default SystemsTable;
