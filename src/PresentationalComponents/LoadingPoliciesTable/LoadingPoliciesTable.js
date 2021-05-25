import React from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import RowLoader from '@redhat-cloud-services/frontend-components-utilities/RowLoader';

const LoadingPoliciesTable = () => (
    <Table
        aria-label='policies-table'
        ouiaId="policiesTable"
        cells={ [
            { title: 'Policy name' },
            { title: 'Operating system' },
            { title: 'Systems' },
            { title: 'Business initiative' },
            { title: 'Compliance threshold' }
        ] }
        rows={ [...Array(5)].map(() => ({
            cells: [{
                title: <RowLoader />,
                colSpan: 5
            }]
        })) }>
        <TableHeader />
        <TableBody />
    </Table>
);

export default LoadingPoliciesTable;
