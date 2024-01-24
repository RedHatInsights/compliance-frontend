import React from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import RowLoader from '@redhat-cloud-services/frontend-components-utilities/RowLoader';
import columns from '../PoliciesTable/Columns';

const LoadingPoliciesTable = () => (
  <Table
    aria-label="Policies"
    ouiaId="PoliciesTable"
    cells={columns}
    rows={[...Array(5)].map(() => ({
      cells: [
        {
          title: <RowLoader />,
          colSpan: 5,
        },
      ],
    }))}
  >
    <TableHeader />
    <TableBody />
  </Table>
);

export default LoadingPoliciesTable;
