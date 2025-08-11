import React from 'react';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

const InventorySystemsTable = (props) => (
  <AsyncComponent module="./SystemsTable" scope="inventory" {...props} />
);

export default InventorySystemsTable;
