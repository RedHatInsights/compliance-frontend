import React from 'react';
import propTypes from 'prop-types';
import columns, { exportableColumns } from './Columns';
import * as Filters from './Filters';

import { emptyRows } from 'PresentationalComponents/NoResultsTable/NoResultsTable';
import useActionResolver from './hooks/useActionResolvers';
import useComplianceTableDefaults from 'Utilities/hooks/useComplianceTableDefaults';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import {
  useRoutePermissionsRbacV1,
  useRoutePermissionsKessel,
} from 'Utilities/hooks/useRoutePermissions';

import ComplianceTable from 'PresentationalComponents/ComplianceTable/ComplianceTable';

const RbacV1Permissions = ({ children }) => {
  const deletePermission = useRoutePermissionsRbacV1(
    `/scappolicies/XYZ/delete`,
  );
  const editPermission = useRoutePermissionsRbacV1(`/scappolicies/XYZ/edit`);
  return children({ deletePermission, editPermission });
};

RbacV1Permissions.propTypes = {
  children: propTypes.func.isRequired,
};

const KesselPermissions = ({ children }) => {
  const deletePermission = useRoutePermissionsKessel(
    `/scappolicies/XYZ/delete`,
  );
  const editPermission = useRoutePermissionsKessel(`/scappolicies/XYZ/edit`);
  return children({ deletePermission, editPermission });
};

KesselPermissions.propTypes = {
  children: propTypes.func.isRequired,
};

const PoliciesTableContent = ({
  policies,
  DedicatedAction,
  total,
  loading,
  options,
  deletePermission,
  editPermission,
}) => {
  const complianceTableDefaults = useComplianceTableDefaults();
  const filters = Object.values(Filters);
  const actionResolver = useActionResolver({
    deletePermission,
    editPermission,
  });

  return (
    <ComplianceTable
      aria-label="Policies"
      ouiaId="PoliciesTable"
      className="compliance-policies-table"
      columns={columns}
      items={policies}
      isStickyHeader
      filters={{ filterConfig: filters }}
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

PoliciesTableContent.propTypes = {
  policies: propTypes.array.isRequired,
  DedicatedAction: propTypes.oneOfType([propTypes.node, propTypes.func]),
  total: propTypes.number,
  loading: propTypes.bool,
  options: propTypes.object,
  deletePermission: propTypes.shape({
    hasAccess: propTypes.bool,
    isLoading: propTypes.bool,
  }),
  editPermission: propTypes.shape({
    hasAccess: propTypes.bool,
    isLoading: propTypes.bool,
  }),
};

export const PoliciesTable = (props) => {
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');

  const PermissionProvider = isKesselEnabled
    ? KesselPermissions
    : RbacV1Permissions;

  return (
    <PermissionProvider>
      {(permissions) => <PoliciesTableContent {...props} {...permissions} />}
    </PermissionProvider>
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
