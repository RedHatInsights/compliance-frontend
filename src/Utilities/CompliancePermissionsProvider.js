import React, { createContext, useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { RBACContext } from '@redhat-cloud-services/frontend-components-utilities/RBAC';
import { getKesselAccessCheckParams } from '@redhat-cloud-services/frontend-components-utilities/kesselPermissions';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { useFetchDefaultWorkspaceId } from 'Utilities/hooks/useKesselWorkspaces';
import { PERMISSION_MAP, KESSEL_PERMISSIONS_LIST } from 'Utilities/permissionConstants';
import { useEnvironment } from 'Utilities/EnvironmentContext';

const defaultCompliancePermissions = {
  isLoading: true,
  checkAccess: () => false,
};

export const CompliancePermissionsContext =
  createContext(defaultCompliancePermissions);

export const useCompliancePermissions = () =>
  useContext(CompliancePermissionsContext);

const HccRbacPermissions = ({ children }) => {
  const rbac = useContext(RBACContext);

  const checkAccess = useCallback(
    (requiredPermissions) =>
      rbac.hasAccess?.(requiredPermissions, false, false) ?? false,
    [rbac],
  );

  const value = useMemo(
    () => ({
      checkAccess,
      isLoading: rbac.isLoading,
    }),
    [checkAccess, rbac.isLoading],
  );

  return (
    <CompliancePermissionsContext.Provider value={value}>
      {children}
    </CompliancePermissionsContext.Provider>
  );
};

HccRbacPermissions.propTypes = {
  children: PropTypes.node.isRequired,
};

const HccKesselPermissions = ({ children }) => {
  const {
    workspaceId,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useFetchDefaultWorkspaceId();

  const checkParams = useMemo(
    () =>
      getKesselAccessCheckParams({
        requiredPermissions: KESSEL_PERMISSIONS_LIST,
        resourceIdOrIds: workspaceId,
      }),
    [workspaceId],
  );

  const { data, loading, error } = useSelfAccessCheck(checkParams);

  const allowedByRelation = useMemo(() => {
    if (!Array.isArray(data)) {
      return new Map();
    }
    return new Map(data.map((item) => [item.relation, item.allowed]));
  }, [data]);

  const checkAccess = useCallback(
    (requiredPermissions) => {
      const relations = requiredPermissions
        .map((p) => PERMISSION_MAP[p])
        .filter(Boolean);
      if (relations.length === 0) {
        return true;
      }
      if (workspaceLoading) {
        return false;
      }
      if (!workspaceId || workspaceError || error) {
        return false;
      }
      return relations.every((rel) => allowedByRelation.get(rel) === true);
    },
    [
      allowedByRelation,
      workspaceLoading,
      workspaceId,
      workspaceError,
      error,
    ],
  );

  const isLoading = workspaceLoading || loading;

  const value = useMemo(
    () => ({
      checkAccess,
      isLoading,
    }),
    [checkAccess, isLoading],
  );

  return (
    <CompliancePermissionsContext.Provider value={value}>
      {children}
    </CompliancePermissionsContext.Provider>
  );
};

HccKesselPermissions.propTypes = {
  children: PropTypes.node.isRequired,
};

const IopPermissionsStub = ({ children }) => {
  const value = useMemo(
    () => ({
      isLoading: false,
      checkAccess: () => true,
    }),
    [],
  );

  return (
    <CompliancePermissionsContext.Provider value={value}>
      {children}
    </CompliancePermissionsContext.Provider>
  );
};

IopPermissionsStub.propTypes = {
  children: PropTypes.node.isRequired,
};

const CompliancePermissionsProvider = ({ children }) => {
  const { isIop, authorizationProvider } = useEnvironment();

  if (isIop) {
    return <IopPermissionsStub>{children}</IopPermissionsStub>;
  }

  if (authorizationProvider === 'kessel') {
    return <HccKesselPermissions>{children}</HccKesselPermissions>;
  }

  return <HccRbacPermissions>{children}</HccRbacPermissions>;
};

CompliancePermissionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CompliancePermissionsProvider;
