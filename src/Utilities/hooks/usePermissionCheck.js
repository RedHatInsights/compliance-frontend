import { useMemo } from 'react';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { getKesselAccessCheckParams } from '@redhat-cloud-services/frontend-components-utilities/kesselPermissions';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { useFetchDefaultWorkspaceId } from 'Utilities/hooks/useKesselWorkspaces';

export const PERMISSION_MAP = {
  'compliance:policy:read': 'compliance_policy_view',
  'compliance:policy:write': 'compliance_policy_edit',
  'compliance:policy:create': 'compliance_policy_new',
  'compliance:policy:delete': 'compliance_policy_remove',
  'compliance:system:read': 'compliance_system_view', // compliance_system_view_assigned
  'compliance:report:read': 'compliance_report_view',
};

export const useRbacV1Permissions = (requiredPermissions) => {
  const { hasAccess, isLoading } = usePermissionsWithContext(
    requiredPermissions,
    false,
    false,
  );
  return { hasAccess, isLoading };
};

export const useKesselPermissions = (requiredPermissions) => {
  const { workspaceId, isLoading: workspaceLoading } =
    useFetchDefaultWorkspaceId();

  const checkParams = useMemo(
    () =>
      getKesselAccessCheckParams({
        permissionMap: PERMISSION_MAP,
        requiredPermissions,
        resourceIdOrIds: workspaceId,
      }),
    [workspaceId, requiredPermissions],
  );

  const { data, loading, error } = useSelfAccessCheck(checkParams);

  if (workspaceLoading) {
    return { hasAccess: false, isLoading: workspaceLoading };
  }

  if (!workspaceId || error) {
    return { hasAccess: false, isLoading: false };
  }

  const hasAccess = Array.isArray(data)
    ? data.every((check) => check.allowed)
    : (data?.allowed ?? false);

  return { hasAccess, isLoading: loading };
};
