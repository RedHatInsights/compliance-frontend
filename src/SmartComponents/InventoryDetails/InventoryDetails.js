import React from 'react';
import propTypes from 'prop-types';
import Skeleton, {
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
import { registryDecorator } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import {
  InventoryDetail,
  DetailWrapper,
} from '@redhat-cloud-services/frontend-components/Inventory';

// 1. This is old.
// 2. This is just used on the SystemDetails nowhere else and it can live there as a sub component and be happy.
@registryDecorator()
class InventoryDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DetailWrapper
        onLoad={({ mergeWithDetail }) =>
          this.getRegistry().register({
            ...mergeWithDetail(),
          })
        }
      >
        <InventoryDetail
          fallback={<Skeleton size={SkeletonSize.md} />}
          hideBack
        />
      </DetailWrapper>
    );
  }
}

InventoryDetails.propTypes = {
  entity: propTypes.object,
};

const ConnectedInventoryDetails = (props) => {
  return <InventoryDetails {...props} />;
};

export default ConnectedInventoryDetails;
