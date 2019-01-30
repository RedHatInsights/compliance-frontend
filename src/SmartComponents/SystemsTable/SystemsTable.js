import React from 'react';
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

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable
        });
    }

    render() {
        const { InventoryCmp } = this.state;
        const { items, disableRemediations } = this.props;
        const tableHeaderButtons = <reactCore.Level gutter="md">
            <reactCore.LevelItem>
                <DownloadTableButton />
            </reactCore.LevelItem>
            <reactCore.LevelItem>
                <ComplianceRemediationButton disableRemediations={disableRemediations} />
            </reactCore.LevelItem>
        </reactCore.Level>;

        //const items = this.props.items;
        // concatenate the names of profiles
        // let hosts = [{ id: '19200f9f-dd49-4ec9-ac91-83009ec0acec', profiles: 'profile 1, profile 2', compliant: 'true' }];
        // Ideally change items to look like the right Entities format
        return (
            <reactCore.Card>
                <InventoryCmp items={items}>
                    { tableHeaderButtons }
                </InventoryCmp>
            </reactCore.Card>
        );
    }
}

SystemsTable.propTypes = {
    items: propTypes.array,
    columns: propTypes.array,
    disableRemediations: propTypes.bool
};

SystemsTable.defaultProps = {
    disableRemediations: false
};

export default SystemsTable;
