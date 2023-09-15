import React from 'react';
import propTypes from 'prop-types';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';

const WithPermission = ({
  children,
  requiredPermissions = [],
  hide = false,
}) => {
  const { hasAccess, isLoading } = usePermissionsWithContext(
    requiredPermissions,
    false,
    false
  );

  if (!isLoading) {
    return hasAccess
      ? children
      : !hide && <NotAuthorized serviceName="Compliance" />;
  } else {
    return '';
  }
};

WithPermission.propTypes = {
  children: propTypes.node,
  requiredPermissions: propTypes.array,
  hide: propTypes.bool,
};

export default WithPermission;
