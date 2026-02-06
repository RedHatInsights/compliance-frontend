import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Spinner } from '@patternfly/react-core';
import {
  ErrorPage,
  PoliciesTable,
  StateView,
  StateViewPart,
} from 'PresentationalComponents';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import CreateLink from 'SmartComponents/CompliancePolicies/components/CreateLink';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import { TableStateProvider } from 'bastilian-tabletools';
import CompliancePageHeader from 'PresentationalComponents/CompliancePageHeader/CompliancePageHeader';
import { policiesPopoverData } from '@/constants';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import {
  useRbacV1Permissions,
  useKesselPermissions,
} from 'Utilities/hooks/usePermissionCheck';

const PERMISSIONS = {
  create: ['compliance:policy:create'],
  edit: ['compliance:policy:write'],
  delete: ['compliance:policy:delete'],
};

const CompliancePoliciesContent = ({ usePermissionsHook }) => {
  const createPermission = usePermissionsHook(PERMISSIONS.create);
  const editPermission = usePermissionsHook(PERMISSIONS.edit);
  const deletePermission = usePermissionsHook(PERMISSIONS.delete);

  const hasCreatePermission =
    !createPermission.isLoading && createPermission.hasAccess;

  const CreateLinkWithPermission = useMemo(
    () =>
      function CreateLinkWrapper() {
        return <CreateLink hasCreatePermission={hasCreatePermission} />;
      },
    [hasCreatePermission],
  );

  // Async table needs info about total policy count before mounting
  // Also required for correctly showing empty state
  const {
    data: totalPolicies,
    error: totalPoliciesError,
    loading: totalPoliciesLoading,
  } = usePolicies({
    onlyTotal: true,
  });

  let {
    data: { data, meta: { total: currentTotalPolicies } = {} } = {},
    error: policiesError,
    loading: policiesLoading,
    exporter,
  } = usePolicies({
    useTableState: true,
    batch: { batchSize: 10 },
  });
  const error = policiesError || totalPoliciesError;

  return (
    <React.Fragment>
      <CompliancePageHeader
        mainTitle={'SCAP policies'}
        popoverData={policiesPopoverData}
      />
      <section className="pf-v6-c-page__main-section">
        <StateView
          stateValues={{
            error: error,
            loading: totalPoliciesLoading,
            showTable: totalPolicies !== undefined && !error,
          }}
        >
          <StateViewPart stateKey="error">
            <ErrorPage error={error} />
          </StateViewPart>
          <StateViewPart stateKey="loading">
            <Spinner />
          </StateViewPart>
          <StateViewPart stateKey="showTable">
            {totalPolicies === 0 ? (
              <Grid hasGutter>
                <ComplianceEmptyState
                  title="No policies"
                  mainButton={
                    <CreateLink hasCreatePermission={hasCreatePermission} />
                  }
                />
              </Grid>
            ) : (
              <PoliciesTable
                policies={data}
                total={currentTotalPolicies}
                loading={policiesLoading}
                DedicatedAction={CreateLinkWithPermission}
                deletePermission={deletePermission}
                editPermission={editPermission}
                options={{
                  exporter,
                }}
              />
            )}
          </StateViewPart>
        </StateView>
      </section>
    </React.Fragment>
  );
};

CompliancePoliciesContent.propTypes = {
  usePermissionsHook: PropTypes.func.isRequired,
};

const CompliancePolicies = () => {
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');

  return (
    <CompliancePoliciesContent
      usePermissionsHook={
        isKesselEnabled ? useKesselPermissions : useRbacV1Permissions
      }
    />
  );
};

const PoliciesWithTableStateProvider = () => (
  <TableStateProvider>
    <CompliancePolicies />
  </TableStateProvider>
);

export default PoliciesWithTableStateProvider;
