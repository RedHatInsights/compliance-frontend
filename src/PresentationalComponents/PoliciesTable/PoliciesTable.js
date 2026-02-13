import React from 'react';
import propTypes from 'prop-types';
import columns, { exportableColumns } from './Columns';
import * as Filters from './Filters';

import { emptyRows } from 'PresentationalComponents/NoResultsTable/NoResultsTable';
import useActionResolver from './hooks/useActionResolvers';
import useComplianceTableDefaults from 'Utilities/hooks/useComplianceTableDefaults';

import ComplianceTable from 'PresentationalComponents/ComplianceTable/ComplianceTable';

export const PoliciesTable = ({
  policies,
  DedicatedAction,
  total,
  loading,
  options,
}) => {
  const complianceTableDefaults = useComplianceTableDefaults();
  const filters = Object.values(Filters);
  const actionResolver = useActionResolver();

  return (
    <ComplianceTable
      useTableParams
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
        ...complianceTableDefaults,
        actionResolver,
        ...(DedicatedAction ? { dedicatedAction: DedicatedAction } : {}),
        exportable: {
          ...complianceTableDefaults.exportable,
          columns: exportableColumns,
        },
        // TODO replace with empty rows component
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
