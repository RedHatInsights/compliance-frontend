import React from 'react';
import propTypes from 'prop-types';
import Skeleton, { SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';
import { registryDecorator } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { InventoryDetail, DetailWrapper } from '@redhat-cloud-services/frontend-components/Inventory';

@registryDecorator()
class InventoryDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DetailWrapper onLoad={({ mergeWithDetail }) => this.getRegistry().register({
                ...mergeWithDetail()
            })}>
                <InventoryDetail fallback={<Skeleton size={ SkeletonSize.md } />} hideBack />
            </DetailWrapper>
        );
    }
}

InventoryDetails.propTypes = {
    entity: propTypes.object
};

const ConnectedInventoryDetails = (props) => {
    return <InventoryDetails {...props} />;
};

export default ConnectedInventoryDetails;
