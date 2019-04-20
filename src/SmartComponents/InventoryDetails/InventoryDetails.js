import React from 'react';
import propTypes from 'prop-types';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import { Skeleton, SkeletonSize, registry as registryDecorator } from '@red-hat-insights/insights-frontend-components';

@registryDecorator()
class InventoryDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <Skeleton size={ SkeletonSize.md } />
        };

        this.fetchInventory = this.fetchInventory.bind(this);
        this.fetchInventory();
    }

    async fetchInventory() {
        const {
            inventoryConnector,
            mergeWithDetail
        } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons
        });

        this.getRegistry().register({
            ...mergeWithDetail()
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryDetail
        });
    }

    render() {
        const { InventoryCmp } = this.state;
        return (
            <React.Fragment>
                <InventoryCmp hideBack />
            </React.Fragment>
        );
    }
}

InventoryDetails.propTypes = {
    entity: propTypes.object
};

export default InventoryDetails;
