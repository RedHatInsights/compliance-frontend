import { useMemo } from 'react';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
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

export const mapPermissionsToKessel = (permissions, workspaceId) =>
  permissions
    .map((perm) => {
      const relation = PERMISSION_MAP[perm];
      if (!relation) {
        console.warn(`No Kessel mapping for: ${perm}`);
        return null;
      }
      return {
        id: workspaceId,
        type: 'workspace',
        relation,
        reporter: { type: 'rbac' },
      };
    })
    .filter(Boolean);

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
    useFetchDefaultWorkspaceId({ enabled: enableWorkspaceQuery });


  const resources = useMemo(
    () =>
      workspaceId
        ? mapPermissionsToKessel(requiredPermissions, workspaceId)
        : [],
    [workspaceId, requiredPermissions],
  );
  console.log('DEBUG resources', resources);

  const isSingleResource = resources.length === 1;

  const checkParams = useMemo(() => {
    if (isSingleResource) {
      return {
        resource: {
          id: resources[0].id,
          type: resources[0].type,
          reporter: resources[0].reporter,
        },
        relation: resources[0].relation,
      };
    }
    return { resources };
  }, [isSingleResource, resources]);

  const { data, loading, error } = useSelfAccessCheck(checkParams);
  if (workspaceId) {
    console.log('DEBUG workspaceId', workspaceId);
    console.log('DEBUG checkParams', checkParams);
    console.log('DEBUG isSingleResource', isSingleResource);
    console.log('DEBUG data', data);
    console.log('DEBUG loading', loading);
    console.log('DEBUG error', error);
  }

  if (workspaceLoading) {
      return { hasAccess: false, isLoading: workspaceLoading };
  }

  if (!workspaceId || error) {
    return { hasAccess: false, isLoading: false };
  }

  let hasAccess = false;
  if (isSingleResource) {
    hasAccess = data?.allowed ?? false;
  } else {
    hasAccess = Array.isArray(data)
      ? data.every((check) => check.allowed)
      : false;
  }

  return { hasAccess, isLoading: loading };
};
