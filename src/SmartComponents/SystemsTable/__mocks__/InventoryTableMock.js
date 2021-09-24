import React, { useLayoutEffect } from 'react';
import propTypes from 'prop-types';
import { Table } from '@patternfly/react-table';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';

const InventoryTableMock = (props) => {
  const { getEntities } = props;
  useLayoutEffect(() => {
    getEntities();
  }, []);

  return (
    <div>
      <PrimaryToolbar {...props} />
      <Table aria-label="Mock inventory table" {...props} />
    </div>
  );
};

InventoryTableMock.propTypes = {
  getEntities: propTypes.func,
};

export default InventoryTableMock;
