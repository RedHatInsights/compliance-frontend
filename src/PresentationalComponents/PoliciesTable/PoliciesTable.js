import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
// import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import columns, { exportableColumns } from './Columns';
import * as Filters from './Filters';
import { emptyRows } from '../../Utilities/hooks/useTableTools/Components/NoResultsTable';
import useActionResolver from './hooks/useActionResolvers';
import TableToolsTable from 'PresentationalComponents/ComplianceTable/ComplianceTable';

export const PoliciesTable = ({ policies, DedicatedAction, numberOfItems }) => {
  const filters = Object.values(Filters);
  const actionResolver = useActionResolver();

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
      total={numberOfItems}
      options={{
        ...COMPLIANCE_TABLE_DEFAULTS,
        actionResolver,
        ...(DedicatedAction ? { dedicatedAction: DedicatedAction } : {}),
        exportable: {
          ...COMPLIANCE_TABLE_DEFAULTS.exportable,
          columns: exportableColumns,
        },
        numberOfItems: numberOfItems ?? null,
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
