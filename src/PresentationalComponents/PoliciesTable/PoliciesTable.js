import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import columns, { exportableColumns } from './Columns';
import * as Filters from './Filters';
import { emptyRows } from '../../Utilities/hooks/useTableTools/Components/NoResultsTable';
import useActionResolver from './hooks/useActionResolvers';

export const PoliciesTable = ({ policies, DedicatedAction }) => {
  const filters = Object.values(Filters);
  const actionResolver = useActionResolver();

  console.log('POLICIES TABLE ITEMS', policies);

  return (
    <TableToolsTable
      aria-label="Policies"
      ouiaId="PoliciesTable"
      className="compliance-policies-table"
      columns={columns}
      items={policies}
      isStickyHeader
      filters={{
        filterConfig: filters,
      }}
      options={{
        ...COMPLIANCE_TABLE_DEFAULTS,
        actionResolver,
        ...(DedicatedAction ? { dedicatedAction: DedicatedAction } : {}),
        exportable: {
          ...COMPLIANCE_TABLE_DEFAULTS.exportable,
          columns: exportableColumns,
        },
        emptyRows: emptyRows('policies', columns.length),
      }}
    />
  );
};

PoliciesTable.propTypes = {
  policies: propTypes.array.isRequired,
  DedicatedAction: propTypes.oneOfType([propTypes.node, propTypes.func]),
};

PoliciesTable.defaultProps = {
  policies: [],
};

export default PoliciesTable;
