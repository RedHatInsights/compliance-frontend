import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
import { BackgroundLink, LinkButton } from 'PresentationalComponents';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import useFeature from 'Utilities/hooks/useFeature';
import columns, { exportableColumns } from './Columns';
import * as Filters from './Filters';
import { emptyRows } from '../../Utilities/hooks/useTableTools/Components/NoResultsTable';
import useActionResolver from './hooks/useActionResolvers';

const DedicatedAction = () => (
  <BackgroundLink
    to="/scappolicies/new"
    component={LinkButton}
    variant="primary"
    ouiaId="CreateNewPolicyButton"
  >
    Create new policy
  </BackgroundLink>
);

export const PoliciesTable = ({ policies }) => {
  const manageColumnsEnabled = useFeature('manageColumns');
  const filters = Object.values(Filters);
  const actionResolver = useActionResolver(policies);

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
        dedicatedAction: DedicatedAction,
        exportable: {
          ...COMPLIANCE_TABLE_DEFAULTS.exportable,
          columns: exportableColumns,
        },
        manageColumns: manageColumnsEnabled,
        emptyRows: emptyRows('policies', columns.length),
      }}
    />
  );
};

PoliciesTable.propTypes = {
  policies: propTypes.array.isRequired,
};

PoliciesTable.defaultProps = {
  policies: [],
};

export default PoliciesTable;
