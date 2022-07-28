import React from 'react';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import {
  InventoryDetail,
  DetailWrapper,
} from '@redhat-cloud-services/frontend-components/Inventory';

const InventoryDetails = () => (
  <DetailWrapper
    onLoad={({ mergeWithDetail }) =>
      getRegistry().register({
        ...mergeWithDetail(),
      })
    }
  >
    <InventoryDetail hideBack />
  </DetailWrapper>
);

export default InventoryDetails;
