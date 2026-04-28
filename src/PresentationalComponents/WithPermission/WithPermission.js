import React from 'react';
import propTypes from 'prop-types';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { usePermissions } from 'Utilities/hooks/usePermissionCheck';

/**
 * Wrapper that renders children when required permissions are met.
 * Otherwise shows the `NotAuthorized` page, or renders nothing when `hide` is true.
 *
 * Permissions are resolved once via {@link CompliancePermissionsProvider}.
 *
 *  @param   {object}                  props                     Component props
 *  @param   {React.ReactElement}      props.children            Component to render
 *  @param   {Array}                   props.requiredPermissions An array of RBAC permissions required to render the component
 *  @param   {boolean}                 props.hide                Boolean to set wether or not to hide the component if required permissions are NOT met
 *
 *  @returns {React.ReactElement|null}                           Returns the component for this route
 *
 *  @category    Compliance
 *  @subcategory Components
 *
 */
const WithPermission = ({
  children,
  requiredPermissions = [],
  hide = false,
}) => {
  const { hasAccess, isLoading } = usePermissions(requiredPermissions);

  if (isLoading) return null;
  return hasAccess
    ? children
    : !hide && <NotAuthorized serviceName="Compliance" />;
};

WithPermission.propTypes = {
  children: propTypes.node,
  requiredPermissions: propTypes.array,
  hide: propTypes.bool,
};

export default WithPermission;
