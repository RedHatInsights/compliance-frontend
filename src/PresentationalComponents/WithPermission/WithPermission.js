import React from 'react';
import propTypes from 'prop-types';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import {
  useRbacV1Permissions,
  useKesselPermissions,
} from 'Utilities/hooks/usePermissionCheck';

const WithRbacV1Permission = ({ requiredPermissions, children, hide }) => {
  const { hasAccess, isLoading } = useRbacV1Permissions(requiredPermissions);

  if (isLoading) return null;
  return hasAccess
    ? children
    : !hide && <NotAuthorized serviceName="Compliance" />;
};

WithRbacV1Permission.propTypes = {
  requiredPermissions: propTypes.array,
  children: propTypes.node,
  hide: propTypes.bool,
};

const WithKesselPermission = ({ requiredPermissions, children, hide }) => {
  const { hasAccess, isLoading } = useKesselPermissions(requiredPermissions);

  if (isLoading) return null;
  return hasAccess
    ? children
    : !hide && <NotAuthorized serviceName="Compliance" />;
};

WithKesselPermission.propTypes = {
  requiredPermissions: propTypes.array,
  children: propTypes.node,
  hide: propTypes.bool,
};

const WithPermission = ({
  children,
  requiredPermissions = [],
  hide = false,
}) => {
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');
  console.log('DEBUG isKesselEnabled', isKesselEnabled);

  return isKesselEnabled ? (
    <WithKesselPermission requiredPermissions={requiredPermissions} hide={hide}>
      {children}
    </WithKesselPermission>
  ) : (
    <WithRbacV1Permission requiredPermissions={requiredPermissions} hide={hide}>
      {children}
    </WithRbacV1Permission>
  );
};

WithPermission.propTypes = {
  children: propTypes.node,
  requiredPermissions: propTypes.array,
  hide: propTypes.bool,
};

export default WithPermission;
