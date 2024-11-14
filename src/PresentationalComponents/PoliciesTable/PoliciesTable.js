import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
import columns, { exportableColumns } from './Columns';
import * as Filters from './Filters';
import { emptyRows } from '../../Utilities/hooks/useTableTools/Components/NoResultsTable';
import useActionResolver from './hooks/useActionResolvers';
import ComplianceTable from 'PresentationalComponents/ComplianceTable/ComplianceTable';

export const PoliciesTable = ({
  policies,
  DedicatedAction,
  total,
  loading,
  options,
}) => {
  const filters = Object.values(Filters);
  const actionResolver = useActionResolver();

  return (
    <ComplianceTable
      aria-label="Policies"
      ouiaId="PoliciesTable"
      className="compliance-policies-table"
      columns={columns}
      items={policies}
      isStickyHeader
      filters={{
        filterConfig: filters,
      }}
      total={total}
      loading={loading}
      options={{
        ...COMPLIANCE_TABLE_DEFAULTS,
        actionResolver,
        ...(DedicatedAction ? { dedicatedAction: DedicatedAction } : {}),
        exportable: {
          ...COMPLIANCE_TABLE_DEFAULTS.exportable,
          columns: exportableColumns,
        },
        emptyRows: emptyRows('policies', columns.length),
        ...options,
      }}
    />
  );
};

PoliciesTable.propTypes = {
  policies: propTypes.array.isRequired,
  DedicatedAction: propTypes.oneOfType([propTypes.node, propTypes.func]),
  total: propTypes.number,
  loading: propTypes.bool,
  options: propTypes.object,
};

export default PoliciesTable;
