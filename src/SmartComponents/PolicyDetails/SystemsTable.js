import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import { routerParams } from '@red-hat-insights/insights-frontend-components';
import { registry as registryDecorator } from '@red-hat-insights/insights-frontend-components';

@registryDecorator()
class SystemsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <div>Loading...</div>
        };

        this.fetchInventory();
    }

    async fetchInventory() {
        const { inventoryConnector, mergeWithEntities, mergeWithDetail } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons
        });

        this.getRegistry().register({
            ...mergeWithEntities(),
            ...mergeWithDetail()
        });

        this.setState({
            InventoryCmp: inventoryConnector()
        });
    }

    render() {
        const { InventoryCmp } = this.state;
        return (
            <InventoryCmp />
        );
    }
}

export default routerParams(SystemsTable);
