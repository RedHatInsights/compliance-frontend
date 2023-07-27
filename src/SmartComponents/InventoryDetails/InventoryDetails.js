import React from 'react';
import propTypes from 'prop-types';
import Skeleton, {
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
import { init } from 'Store';

import {
  DetailWrapper,
  InventoryDetailHead,
} from '@redhat-cloud-services/frontend-components/Inventory';

const InventoryDetails = ({ inventoryId }) => {
  return (
    <DetailWrapper
      onLoad={({ mergeWithDetail }) =>
        init().register({
          ...mergeWithDetail(),
        })
      }
      inventoryId={inventoryId}
    >
      <InventoryDetailHead fallback={<Skeleton size={SkeletonSize.md} />} />
    </DetailWrapper>
  );
};

InventoryDetails.propTypes = {
  inventoryId: propTypes.string,
};

export default InventoryDetails;
