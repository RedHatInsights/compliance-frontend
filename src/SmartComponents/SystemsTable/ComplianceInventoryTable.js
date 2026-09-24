import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useStore } from 'react-redux';
import { InventoryTable as HccInventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { getAppConfig } from '@/config/appConfig';

const IopInventoryTable = forwardRef(
  ({ tableProps = {}, showTags = false, ...props }, ref) => {
    const store = useStore();

    return (
      <AsyncComponent
        {...props}
        scope="inventory"
        module="./IOPInventoryTable"
        store={store}
        showTags={showTags}
        innerRef={ref}
        tableProps={{
          ...tableProps,
          envContext: {
            ...tableProps.envContext,
            loadChromeless: true,
          },
        }}
      />
    );
  },
);

IopInventoryTable.displayName = 'IopInventoryTable';

IopInventoryTable.propTypes = {
  tableProps: PropTypes.object,
  showTags: PropTypes.bool,
};

const ComplianceInventoryTable = forwardRef((props, ref) => {
  if (getAppConfig().envTarget === 'iop') {
    return <IopInventoryTable {...props} ref={ref} />;
  }

  return <HccInventoryTable {...props} ref={ref} />;
});

ComplianceInventoryTable.displayName = 'ComplianceInventoryTable';

export default ComplianceInventoryTable;
