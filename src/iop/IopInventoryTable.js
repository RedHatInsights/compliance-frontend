import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useStore } from 'react-redux';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

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

export default IopInventoryTable;
