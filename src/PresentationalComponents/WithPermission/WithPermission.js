import React from 'react';
import propTypes from 'prop-types';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import { useDefaultWorkspace } from 'Utilities/hooks/useKesselWorkspaces';

/**
 * Wrapper component to either render a component if required permissions are met,
 * Show the `NotAuthorized` page, or do not render the component at all
 *
 *  @param   {object}             props                     Component props
 *  @param   {React.ReactElement} props.children            Component to render
 *  @param   {Array}              props.requiredPermissions An array of RBAC permissions required to render the component
 *  @param   {boolean}            props.hide                Boolean to set wether or not to hide the component if required permissions are NOT met
 *
 *  @returns {React.ReactElement}                           Returns the component for this route
 *
 *  @category    Compliance
 *  @subcategory Components
 *
 */

const PERMISSION_MAP = {
  'compliance:policy:read': 'compliance_policy_view',
  'compliance:policy:write': 'compliance_policy_edit',
  'compliance:policy:create': 'compliance_policy_new',
  'compliance:policy:delete': 'compliance_policy_remove',
  'compliance:system:read': 'compliance_system_view', // compliance_system_view_assigned
  'compliance:report:read': 'compliance_report_view',
  // 'compliance:*:*': 'compliance_all_all',
};

const mapPermissionsToKessel = (permissions, workspaceId) =>
  permissions
    .map((perm) => {
      const relation = PERMISSION_MAP[perm];
      if (!relation) {
        console.warn(`No Kessel mapping for: ${perm}`);
        return null;
      }
      return { id: workspaceId, type: 'workspace', relation };
    })
    .filter(Boolean);

const useRbacV1 = (requiredPermissions) => {
  const { hasAccess, isLoading } = usePermissionsWithContext(
    requiredPermissions,
    false,
    false,
  );
  return { hasAccess, isLoading };
};

const useKessel = (requiredPermissions) => {
  const { workspaceId, isLoading: workspaceLoading } = useDefaultWorkspace();

  const resources = workspaceId
    ? mapPermissionsToKessel(requiredPermissions, workspaceId)
    : [];

  const isSingleResource = resources.length === 1;

  // Single check: { resource: { id, type }, relation }
  // Bulk check: { resources: [{ id, type, relation }, ...] }
  const checkParams = isSingleResource
    ? {
        resource: { id: resources[0].id, type: resources[0].type },
        relation: resources[0].relation,
      }
    : { resources: resources };

  const { data, loading, error } = useSelfAccessCheck(checkParams);
  if (workspaceId) {
    console.log('DEBUG checkParams', checkParams);
    console.log('DEBUG isSingleResource', isSingleResource);
    console.log('DEBUG data', data);
    console.log('DEBUG loading', loading);
    console.log('DEBUG error', error);
  }

  if (workspaceLoading) {
    return { hasAccess: false, isLoading: true };
  }

  if (!workspaceId) {
    console.error('No workspace ID available');
    return { hasAccess: false, isLoading: false };
  }

  if (error) {
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

const WithRbacV1Permission = ({ requiredPermissions, render }) => {
  const { hasAccess, isLoading } = useRbacV1(requiredPermissions);
  return render({ hasAccess, isLoading });
};

const WithKesselPermission = ({ requiredPermissions, render }) => {
  const { hasAccess, isLoading } = useKessel(requiredPermissions);
  return render({ hasAccess, isLoading });
};

const WithPermission = ({
  children,
  requiredPermissions = [],
  hide = false,
}) => {
  const isKesselEnabled = useFeatureFlag('hbi.kessel-migration');
  console.log('DEBUG isKesselEnabled', isKesselEnabled);

  const renderContent = ({ hasAccess, isLoading }) => {
    if (isLoading) return null;
    return hasAccess
      ? children
      : !hide && <NotAuthorized serviceName="Compliance" />;
  };

  return isKesselEnabled ? (
    <WithKesselPermission
      requiredPermissions={requiredPermissions}
      hide={hide}
      render={renderContent}
    />
  ) : (
    <WithRbacV1Permission
      requiredPermissions={requiredPermissions}
      hide={hide}
      render={renderContent}
    />
  );
};

WithPermission.propTypes = {
  children: propTypes.node,
  requiredPermissions: propTypes.array,
  hide: propTypes.bool,
};

export default WithPermission;
